from db.neo4j import test_connection
from db.models import Base
from db.database import engine
from fastapi import FastAPI
from routes import auth

app = FastAPI()
app.include_router(auth.router)

if __name__ == "__main__":
    test_connection()
    Base.metadata.create_all(bind=engine)