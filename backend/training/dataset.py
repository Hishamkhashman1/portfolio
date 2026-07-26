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

    return cleaned_data
# print (cleaning_data(conversations_data))
