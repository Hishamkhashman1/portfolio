import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from backend.model import inference
from backend.training import train as train_module


class TrainingAndInferenceTestCase(unittest.TestCase):
    def test_train_creates_artifact_and_inference_uses_it(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            artifact_path = Path(temp_dir) / "portfolio_retriever.json"

            with patch.object(train_module, "ARTIFACT_PATH", artifact_path):
                train_summary = train_module.train()

            self.assertTrue(artifact_path.exists())
            self.assertGreater(train_summary["sample_count"], 0)
            self.assertGreater(train_summary["train_count"], 0)

            with patch.object(inference, "ARTIFACT_PATH", artifact_path):
                inference.load_artifact.cache_clear()
                answer = inference.answer_from_messages(
                    [SimpleNamespace(role="user", content="what do you do")]
                )

            with artifact_path.open("r", encoding="utf-8") as file:
                payload = json.load(file)

            self.assertEqual(payload["model_type"], "tfidf_retriever")
            self.assertTrue(answer)
            self.assertNotIn("placeholder", answer.lower())

    def test_latest_user_message_uses_last_user_message(self):
        messages = [
            SimpleNamespace(role="assistant", content="hello"),
            SimpleNamespace(role="user", content="first"),
            SimpleNamespace(role="assistant", content="ok"),
            SimpleNamespace(role="user", content="second"),
        ]

        self.assertEqual(inference.latest_user_message(messages), "second")


if __name__ == "__main__":
    unittest.main()
