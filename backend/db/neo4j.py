from neo4j import GraphDatabase
import os

# Use environment variables or hardcode for now
NEO4J_URI = os.getenv("NEO4J_URI", "Your connection URI here")
NEO4J_USER = os.getenv("NEO4J_USER", "Your username here")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "Your password here")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def get_driver():
    return driver

def close_driver():
    driver.close()

def test_connection():
    with driver.session() as session:
        greeting = session.run("RETURN 'Hello from Neo4j Aura!' AS message")
        for record in greeting:
            print(record["message"])
