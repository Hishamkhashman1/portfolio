from __future__ import annotations

import json
import random
import sys
from pathlib import Path
from typing import Any

try:
    import torch
    from torch.utils.data import DataLoader, Dataset
    from transformers import (
        AutoModelForSeq2SeqLM,
        AutoTokenizer,
        DataCollatorForSeq2Seq,
        get_linear_schedule_with_warmup,
    )
except ImportError:  # pragma: no cover - optional until the venv dependencies are present
    torch = None  # type: ignore[assignment]
    DataLoader = Dataset = None  # type: ignore[assignment]
    AutoModelForSeq2SeqLM = AutoTokenizer = DataCollatorForSeq2Seq = get_linear_schedule_with_warmup = None  # type: ignore[assignment]

if __package__ is None or __package__ == "":
    project_root = Path(__file__).resolve().parents[2]
    if str(project_root) not in sys.path:
        sys.path.insert(0, str(project_root))

from backend.model.portfolio_llm import (
    ARTIFACT_DIR,
    BASE_MODEL_NAME,
    answer_from_messages,
    build_prompt,
    generate_third_person_variants,
    normalize_answer_person,
)
from backend.model.tokenizer import normalize_text
from backend.training.dataset import build_for_training, conversations_data


RANDOM_SEED = 42
VAL_RATIO = 0.15
MAX_SOURCE_LENGTH = 192
MAX_TARGET_LENGTH = 128
BATCH_SIZE = 4
EPOCHS = 1
LEARNING_RATE = 5e-5


def split_samples(
    samples: list[dict[str, str]],
    validation_ratio: float = VAL_RATIO,
) -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    if not samples:
        return [], []

    shuffled = samples.copy()
    random.Random(RANDOM_SEED).shuffle(shuffled)

    if len(shuffled) == 1:
        return shuffled, []

    validation_size = max(1, int(len(shuffled) * validation_ratio))
    validation_size = min(validation_size, len(shuffled) - 1)

    return shuffled[:-validation_size], shuffled[-validation_size:]


def build_training_examples(samples: list[dict[str, str]]) -> list[dict[str, str]]:
    examples: list[dict[str, str]] = []

    for sample in samples:
        question = sample["input_text"].strip()
        answer = sample["target_text"].strip()

        if not question or not answer:
            continue

        examples.append({"question": question, "answer": answer})

        third_person_answer = normalize_answer_person(answer)
        for variant_question in generate_third_person_variants(question):
            examples.append({"question": variant_question, "answer": third_person_answer})

    return examples


class PortfolioQADataset(Dataset):
    def __init__(
        self,
        examples: list[dict[str, str]],
        tokenizer: AutoTokenizer,
    ) -> None:
        self.examples = examples
        self.tokenizer = tokenizer

    def __len__(self) -> int:
        return len(self.examples)

    def __getitem__(self, index: int) -> dict[str, Any]:
        item = self.examples[index]
        prompt = build_prompt(item["question"])
        tokenized = self.tokenizer(
            prompt,
            truncation=True,
            max_length=MAX_SOURCE_LENGTH,
        )
        labels = self.tokenizer(
            text_target=item["answer"],
            truncation=True,
            max_length=MAX_TARGET_LENGTH,
        )

        tokenized["labels"] = labels["input_ids"]
        return tokenized


def generate_answer(
    model: AutoModelForSeq2SeqLM,
    tokenizer: AutoTokenizer,
    question: str,
    device: torch.device,
) -> str:
    inputs = tokenizer(
        build_prompt(question),
        return_tensors="pt",
        truncation=True,
        max_length=MAX_SOURCE_LENGTH,
    )
    inputs = {key: value.to(device) for key, value in inputs.items()}

    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=96,
            num_beams=4,
            do_sample=False,
            early_stopping=True,
            no_repeat_ngram_size=3,
        )

    return tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()


def evaluate(
    model: AutoModelForSeq2SeqLM,
    tokenizer: AutoTokenizer,
    validation_examples: list[dict[str, str]],
    device: torch.device,
) -> dict[str, float]:
    if not validation_examples:
        return {"exact_match": 0.0, "average_overlap": 0.0}

    correct = 0
    overlap_total = 0.0

    for example in validation_examples:
        prediction = generate_answer(model, tokenizer, example["question"], device)
        gold_tokens = set(normalize_text(example["answer"]))
        pred_tokens = set(normalize_text(prediction))

        if prediction.strip() == example["answer"].strip():
            correct += 1

        if gold_tokens and pred_tokens:
            overlap_total += len(gold_tokens & pred_tokens) / len(gold_tokens | pred_tokens)

    return {
        "exact_match": correct / len(validation_examples),
        "average_overlap": overlap_total / len(validation_examples),
    }


def train() -> dict[str, Any]:
    if (
        torch is None
        or DataLoader is None
        or Dataset is None
        or AutoTokenizer is None
        or AutoModelForSeq2SeqLM is None
        or DataCollatorForSeq2Seq is None
        or get_linear_schedule_with_warmup is None
    ):
        raise RuntimeError(
            "Pretrained training dependencies are missing. Activate the project venv first."
        )

    samples = build_for_training(conversations_data)
    examples = build_training_examples(samples)
    train_examples, validation_examples = split_samples(examples)

    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(BASE_MODEL_NAME)

    train_dataset = PortfolioQADataset(train_examples, tokenizer)
    validation_dataset = PortfolioQADataset(validation_examples, tokenizer)
    data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=model, label_pad_token_id=-100)

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        collate_fn=data_collator,
    )

    device = torch.device("cpu")
    model.to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE)
    total_steps = max(len(train_loader) * EPOCHS, 1)
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=max(1, total_steps // 10),
        num_training_steps=total_steps,
    )

    model.train()
    for _epoch in range(EPOCHS):
        for batch in train_loader:
            batch = {key: value.to(device) for key, value in batch.items()}
            outputs = model(**batch)
            loss = outputs.loss
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            scheduler.step()
            optimizer.zero_grad(set_to_none=True)

    validation_metrics = evaluate(model, tokenizer, validation_examples, device)

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(ARTIFACT_DIR)
    tokenizer.save_pretrained(ARTIFACT_DIR)

    metadata = {
        "model_type": "flan_t5_seq2seq",
        "base_model": BASE_MODEL_NAME,
        "created_at": "2026-07-28T00:00:00Z",
        "sample_count": len(samples),
        "augmented_count": len(examples),
        "train_count": len(train_examples),
        "validation_count": len(validation_examples),
        "validation_metrics": validation_metrics,
        "artifact_dir": str(ARTIFACT_DIR),
    }

    with (ARTIFACT_DIR / "training_metadata.json").open("w", encoding="utf-8") as file:
        json.dump(metadata, file, indent=2, ensure_ascii=False)

    return metadata


def main() -> None:
    summary = train()
    print(f"saved artifact: {summary['artifact_dir']}")
    print(
        "samples: "
        f"{summary['sample_count']} | "
        f"augmented: {summary['augmented_count']} | "
        f"train: {summary['train_count']} | "
        f"validation: {summary['validation_count']}"
    )
    print(
        "validation exact match: "
        f"{summary['validation_metrics']['exact_match']:.3f} | "
        f"average overlap: {summary['validation_metrics']['average_overlap']:.3f}"
    )


if __name__ == "__main__":
    main()
