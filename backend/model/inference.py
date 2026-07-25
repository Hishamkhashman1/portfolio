from app.schemas import ChatMessage
import re
# add import for examples

def respond(messages,examples):
    last_message = messages[-1]
    normalized_text = last_message.lower()
    normalized_text = re.sub(r'\s+', ' ', last_message).strip
    normalized_text = re.sub(r'[^\w\s]', '', last_message)
    
    for example in examples:
        if example in normalized_text:
            return example
        else:
            return "sorry, I am still learning"




