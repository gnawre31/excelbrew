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
    text: str
    columns: list = []
    cells: list = []
def replaceCellLabel(text, payload):
    for c in payload.columns:
        if len(c["header"]) > 0 and len(c["column"]) > 0:
            text = text.replace(c["header"].lower(),"column " + c["column"].upper())
    for c in payload.cells:
        if len(c["header"]) > 0 and len(c["cell"]) > 0:
            text = text.replace(c["header"].lower(),"cell " + c["cell"].upper())
    return text


@app.post("/get_formula")
def getFormula(payload:Payload):

    # replace words in text with column and cell IDs
    text = payload.text.lower()
    text = replaceCellLabel(text, payload)
    prompt = "Generate an Excel formula to: " + text

    # call openAI API
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0,
        max_tokens=300,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return {"data": {"text":response.choices[0].text, "finish_reason":response.choices[0].finish_reason}}
