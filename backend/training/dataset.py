import json

from pathlib import Path


path_json = Path(__file__).resolve().parents[1] / "data" / "conversations.json"



with open(path_json, 'r', encoding='utf-8') as file:
    conversations_data = json.load(file)

print(conversations_data)

