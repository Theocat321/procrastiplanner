''''''
import sys
import os
import numpy as np

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.dirname(os.path.abspath(__file__)))


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hey")
async def  temp():
    '''
    Temporary endpoint for testing purposes.
    Returns a simple JSON response.    
    '''
    return {"status":"okay"}
