from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import os
import openai
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()



openai.api_key = os.environ.get('OPEN_AI_KEY')



app = FastAPI()

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
    text = payload.text.lower()
    text = replaceCellLabel(text, payload)

    # return {"data":{"text":"hi","finish_reason":"stop"}}
    print(text)
    prompt = "Generate an Excel formula to: " + text
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
