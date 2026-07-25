from app.schemas import ChatMessage
import re
# add import for examples

def respond(messages,examples):
    last_message = messages[-1]
    normalized_text = last_message.lower()   # this makes everything lowercase ..duh
    normalized_text = re.sub(r'\s+', ' ', last_message).strip #this removes extra whitespaces, newlines and tabs
    normalized_text = re.sub(r'[^\w\s]', '', last_message) # this removes punctuation and special chars (keeps numbs and letters dooog)
    
    for example in examples:
        if example in normalized_text:
            return example
        else:
            return "sorry, I am still learning"




