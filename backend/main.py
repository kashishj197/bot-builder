from db.neo4j import test_connection
from db.models import Base
from db.database import engine
from fastapi import FastAPI
from routes import auth
from routes import bots
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # fallback for React
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # or ["*"] to allow all (not recommended in prod)
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods
    allow_headers=["*"],              # Allow all headers (e.g. Authorization)
)

app.include_router(auth.router)
app.include_router(bots.router)

test_connection()
Base.metadata.create_all(bind=engine)

# if __name__ == "__main__":
