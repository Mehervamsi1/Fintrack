from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, expenses, income, investments, assets, goals, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fintrack API", description="Financial Tracking Application API", version="0.1.0")

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(income.router)
app.include_router(investments.router)
app.include_router(assets.router)
app.include_router(goals.router)
app.include_router(dashboard.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Fintrack API"}
