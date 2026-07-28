import unittest

from backend.model.tokenizer import build_vocab, decode, encode, normalize_text


class TokenizerTestCase(unittest.TestCase):
    def test_normalize_text_strips_punctuation_and_whitespace(self):
        self.assertEqual(normalize_text(" Hello,   world! "), ["hello", "world"])

    def test_encode_and_decode_round_trip(self):
        vocab = {"<unk>": 0, "hello": 1, "world": 2}

        encoded = encode("hello world", vocab)

        self.assertEqual(encoded, [1, 2])
        self.assertEqual(decode(encoded, vocab), "hello world")

    def test_build_vocab_includes_tokens_from_cleaned_mapping(self):
        vocab = build_vocab(
            {
                "who are you": "I am Hisham",
                "what do you do": "I build software",
            }
        )

        self.assertIn("<unk>", vocab)
        self.assertIn("who", vocab)
        self.assertIn("hisham", vocab)
        self.assertIn("software", vocab)


if __name__ == "__main__":
    unittest.main()
