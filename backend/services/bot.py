from db.neo4j import get_driver
from uuid import uuid4
from datetime import datetime

def create_bot_in_neo(name: str, user_id: int) -> str:
    bot_id = str(uuid4())
    driver = get_driver()

    query = """
    CREATE (b:Bot {
        id: $bot_id,
        name: $name,
        created_at: datetime(),
        updated_at: datetime(),
        user_id: $user_id
    })
    RETURN b.id AS id
    """

    with driver.session() as session:
        result = session.run(query, {
            "bot_id": bot_id,
            "name": name,
            "user_id": user_id
        })
        return result.single()["id"]
    
def get_user_bots_from_neo(user_id: int) -> list:
    driver = get_driver()

    query = """
    MATCH (b:Bot {user_id: $user_id})
    RETURN b.id AS id, b.name AS name, b.created_at AS created_at, b.updated_at AS updated_at
    """

    with driver.session() as session:
        result = session.run(query, {"user_id": user_id})
        return [record.data() for record in result]
