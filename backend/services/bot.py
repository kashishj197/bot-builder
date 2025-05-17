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
        bots = []
        for record in result:
            bots.append({
                "id": record["id"],
                "name": record["name"],
                "created_at": str(record["created_at"]),
                "updated_at": str(record["updated_at"]),
            })
        return bots


def get_bot_with_flow(bot_id: str):
    driver = get_driver()

    query = """
    MATCH (b:Bot {id: $bot_id})
    OPTIONAL MATCH (b)-[:HAS_NODE]->(n:Node)
    OPTIONAL MATCH (n)-[:LEADS_TO]->(m:Node)
    RETURN b, collect(DISTINCT n) AS nodes, collect({source: n.id, target: m.id}) AS edges
    """

    with driver.session() as session:
        result = session.run(query, {"bot_id": bot_id})
        record = result.single()
        if not record:
            return None

        bot_node = record["b"]
        nodes = [dict(node) for node in record["nodes"] if node]
        edges = record["edges"]
        
        return {
            "id": bot_node["id"],
            "name": bot_node["name"],
            "created_at": str(bot_node["created_at"]),
            "updated_at": str(bot_node["updated_at"]),
            "user_id": bot_node.get("user_id"),
            "nodes": nodes,
            "edges": edges
        }
