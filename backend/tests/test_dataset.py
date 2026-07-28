import unittest

from backend.training.dataset import build_for_training, cleaning_data


class DatasetTestCase(unittest.TestCase):
    def test_cleaning_data_returns_mapping(self):
        samples = [
            {"input_text": "who are you", "target_text": "I am Hisham"},
            {"input_text": "who are you", "target_text": "I am the same person"},
        ]

        cleaned = cleaning_data(samples)

        self.assertEqual(cleaned["who are you"], "I am the same person")

    def test_build_for_training_preserves_all_examples(self):
        samples = [
            {"input_text": "who are you", "target_text": "I am Hisham"},
            {"input_text": "who are you", "target_text": "I am still Hisham"},
            {"input_text": " ", "target_text": "skip me"},
            None,
        ]

        training_samples = build_for_training(samples)

        self.assertEqual(len(training_samples), 2)
        self.assertEqual(training_samples[0]["input_text"], "who are you")
        self.assertEqual(training_samples[1]["target_text"], "I am still Hisham")


if __name__ == "__main__":
    unittest.main()
