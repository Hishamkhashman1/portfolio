from app.schemas import ChatMessage, ChatRequest
import re
# add import for seeded data of questions and their answers

confidence = 0.7

def user_message(messages):
    user_messages = []
    for message in messages:
        if message.role == "user":
            user_messages.append(message)

    last_message = user_messages[-1]

    return last_message


def nlp_text(last_message):
    lc_text = last_message.lower()   # this makes everything lowercase ..duh
    rwsnlt_text = re.sub(r'\s+', ' ', lc_text).strip() #this removes extra whitespaces, newlines and tabs
    normalized_text = re.sub(r'[^\w\s]', '', rwsnlt_text) # this removes punctuation and special chars (keeps numbs and letters dooog)

    return normalized_text


words = nlp_text(last_message).split()

def matching_percent(words,seed_data):
    fillers = ["if","or","and","why","when","where","what"] #add up all possible fillers
    count = 0
    for w in words:
        if w in seed_data and w not in fillers:
            count +=1
    if count > 0:
        match_level = count // len(seed_data)
    
    return match_level

def response(match_level,response):
    if match_level >= confidence:
        return response
    else:
        return "I am not sure, sorry! I am still learning"

