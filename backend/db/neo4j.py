from neo4j import GraphDatabase
import os

# Use environment variables or hardcode for now
NEO4J_URI = os.getenv("NEO4J_URI", "neo4j+s://4e4b67c6.databases.neo4j.io")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "SOSlZAR32IoCWe5gHzqYkSKrXzfWx_QFtOhHGtu4n2g")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def close_driver():
    driver.close()

def test_connection():
    with driver.session() as session:
        greeting = session.run("RETURN 'Hello from Neo4j Aura!' AS message")
        for record in greeting:
            print(record["message"])
