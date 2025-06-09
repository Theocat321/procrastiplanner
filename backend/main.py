from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import schedule


app = FastAPI(
    title="Procrastiplanner API",
    version="0.1.0",
    description="Creates an intentionally awful schedule to help you procrastinate."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,         
    allow_methods=["*"],
    allow_headers=["*"],
)

# include our schedule router
app.include_router(schedule.router)

@app.get("/", include_in_schema=False)
async def healthcheck():
    return {"status": "ok"}
