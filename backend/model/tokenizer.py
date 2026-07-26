from training.dataset import cleaning_data, conversations_data

final_cleaned = cleaning_data(conversations_data)


def build_vocab(final_cleaned):
    token_to_id = {}

    for input_text, target_text in final_cleaned.items():
        for text in (input_text,target_text):
            for token in text.lower().split():
                if token not in token_to_id:
                    token_to_id[token] = len(token_to_id)

    return token_to_id

print (build_vocab(final_cleaned))



  # def build_vocab(cleaned_items):
  #     token_to_id = {"<unk>": 0}
  #
  #     for item in cleaned_items:
  #         for text in (item["input_text"], item["target_text"]):
  #             for token in text.lower().split():
  #                 if token not in token_to_id:
  #                     token_to_id[token] = len(token_to_id)
  #
  #     return token_to_id

      #
      # for input_text, target_text in cleaned_data.items():
      #     for text in (input_text, target_text):
      #         for token in text.lower().split():
      #             if token not in token_to_id:
      #                 token_to_id[token] = len(token_to_id)

