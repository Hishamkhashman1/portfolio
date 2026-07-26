from backend.training.dataset import cleaning_data, conversations_data
import re

final_cleaned = cleaning_data(conversations_data)


def normalize_text(sample_text):
    lower_text = sample_text.lower()
    no_punct_text = re.sub(r"[^\w\s]", "", lower_text)
    clean_text = re.sub(r"\s+", " ", no_punct_text).strip()
    return clean_text.split()


def build_vocab(final_cleaned):
    token_to_id = {"<unk>":0}

    for input_text, target_text in final_cleaned.items():
        for text in (input_text, target_text):
            for token in normalize_text(text):
                if token not in token_to_id:
                    token_to_id[token] = len(token_to_id)

    return token_to_id

#print(build_vocab(final_cleaned))

def encode(text, token_to_id):
    tokens = normalize_text(text)
    encoded = []

    for token in tokens:
        if token in token_to_id:
            encoded.append(token_to_id[token])
        else:
            encoded.append(token_to_id["<unk>"])
    
    return encoded
