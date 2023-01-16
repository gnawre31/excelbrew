from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import os
import openai
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# load env
from dotenv import load_dotenv
load_dotenv()

# fastapi init
app = FastAPI()

# connect openAPI
openai.api_key = os.getenv('OPEN_AI_KEY')


# CORS
origins = "http://localhost:5173/"
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Payload(BaseModel):
    product: str
    user_input: str
    labels: list = []


def replaceCellLabel(payload):
    user_input = payload.user_input.lower()
    for c in payload.labels:
        if len(c["label"]) > 0 and len(c["name"]) > 0:
            user_input = user_input.replace(c["label"].lower(),c["type"] + " " + c["name"].upper())
    return user_input


@app.post("/get_formula")
def getFormula(payload:Payload):

    # replace words in text with column and cell IDs
    user_input = replaceCellLabel(payload)

    # print(user_input)
    # return {"data":{"response":"hi","finish_reason":"stop"}}

    prompt = ("Generate an {} formula to: {}").format(payload.product,user_input) 
    print(prompt)

    # call openAI API
    apiResponse = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0,
        max_tokens=300,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    response = apiResponse.choices[0].text
    response = response[2:]
    finish_reason = apiResponse.choices[0].finish_reason
    return {"data": {"response":response, "finish_reason":finish_reason}}
