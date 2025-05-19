import json
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
        raw_nodes = record["nodes"]
        edges = record["edges"]

        # Map nodes to React Flow format with position
        nodes = []
        for node in raw_nodes:
            if not node:
                continue
            nodes.append({
                "id": node["id"],
                "type": node.get("type", "default"),
                "data": json.loads(node.get('data', {})),
                "position": {
                    "x": node.get("posX", 100),
                    "y": node.get("posY", 100)
                }
            })

        return {
            "id": bot_node["id"],
            "name": bot_node["name"],
            "created_at": str(bot_node["created_at"]),
            "updated_at": str(bot_node["updated_at"]),
            "user_id": bot_node.get("user_id"),
            "nodes": nodes,
            "edges": edges
        }

def save_bot_flow_in_neo(bot_id: str, flow_data: dict) -> bool:
    driver = get_driver()

    # Extract nodes and edges from flow_data
    nodes = flow_data.get("nodes", [])
    edges = flow_data.get("edges", [])

    # Start a new session
    with driver.session() as session:
        # First, delete existing nodes and edges for the bot
        session.run(
            """
            MATCH (b:Bot {id: $bot_id})-[:HAS_NODE]->(n:Node)
            DETACH DELETE n
            """, {"bot_id": bot_id}
        )

        # Create new nodes and edges
        for node in nodes:
            session.run(
                """
                MATCH (b:Bot {id: $bot_id})
                CREATE (b)-[:HAS_NODE]->(n:Node {
                    id: $id,
                    type: $type,
                    data: $data,
                    posX: $x,
                    posY: $y,
                    created_at: datetime(),
                    updated_at: datetime()
                })
                """,
                {
                    "bot_id": bot_id,
                    "id": node["id"],
                    "data": json.dumps(node.get("data", {})),
                    "type": node["type"],
                    "x": node.get("position", {}).get("x", 100),
                    "y": node.get("position", {}).get("y", 100),
                },
            )

        # Create edges (LEADS_TO)
        for edge in edges:
            session.run(
                """
                MATCH (a:Node {id: $source})<-[:HAS_NODE]-(b:Bot {id: $bot_id}),
                      (c:Node {id: $target})<-[:HAS_NODE]-(b)
                CREATE (a)-[:LEADS_TO]->(c)
                """,
                {
                    "bot_id": bot_id,
                    "source": edge["source"],
                    "target": edge["target"],
                },
            )

    return True