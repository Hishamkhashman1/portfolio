import json

from pathlib import Path


path_json = Path(__file__).resolve().parents[1] / "data" / "conversations.json"



with open(path_json, 'r', encoding='utf-8') as file:
    conversations_data = json.load(file)

#print(conversations_data)



def cleaning_data(conversations_data):
    cleaned_data = []
    for items in conversations_data:
        if items != None and 'input_text' in items and 'target_text' in items:
            cleaned_data.append(items)
    
    final_cleaned = {}


    for i in range(len(cleaned_data)):
        text_a = cleaned_data[i]['input_text'].strip()
        text_b = cleaned_data[i]['target_text'].strip()

        if text_a and text_b:
            final_cleaned[text_a] = text_b

    return final_cleaned

#print (cleaning_data(conversations_data))

#this function purpose is to generate list for training , cleaning_data is generating dict for easier and faster lookup...
def build_for_training(conversations_data):
      samples_for_training = []

      for item in conversations_data:
          if not item:
              continue

          input_text = item.get("input_text", "").strip()
          target_text = item.get("target_text", "").strip()

          if not input_text or not target_text:
              continue

          samples_for_training.append({
              "input_text": input_text,
              "target_text": target_text,
          })

      return samples_for_training
