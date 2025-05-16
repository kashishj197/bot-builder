from db.neo4j import test_connection
from db.models import Base
from db.database import engine

if __name__ == "__main__":
    test_connection()
    Base.metadata.create_all(bind=engine)