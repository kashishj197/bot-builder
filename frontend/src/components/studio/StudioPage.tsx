// src/components/studio/StudioPage.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeSidebar from "./NodeSidebar";
import CustomNode from "./Nodes/CustomNodes";
import TestBotDrawer from "./TestBot";

interface StudioPageProps {
  botId: string;
}

const StudioPage: React.FC<StudioPageProps> = ({ botId }) => {
  const nodeTypes = useMemo(() => ({ default: CustomNode }), []);
  const [botName, setBotName] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const fetchBotFlow = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/bots/${botId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setBotName(data.name);

      if (!data.nodes || data.nodes.length === 0) {
        const startNode: Node = {
          id: "start",
          type: "default",
          position: { x: 100, y: 100 },
          data: {
            label: "Start",
            type: "start",
          },
          sourcePosition: Position.Right,
          deletable: false,
        };

        const endNode: Node = {
          id: "end",
          type: "default",
          position: { x: 600, y: 400 },
          data: {
            label: "End",
            type: "end",
          },
          targetPosition: Position.Left,
          deletable: false,
        };

        setNodes([startNode, endNode]);
        setEdges([]);
      } else {
        setNodes(data.nodes);
        setEdges(data.edges || []);
      }
    } catch (error) {
      console.error("Error fetching bot flow:", error);
    }
  }, [botId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = (type: "message" | "user_input") => {
    const newNode: Node = {
      id: nanoid(),
      type: "default",
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: type === "message" ? "New Message" : "User Input",
        type,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  useEffect(() => {
    fetchBotFlow();
  }, [fetchBotFlow]);

  return (
    <div className="flex">
      <NodeSidebar onAddNode={onAddNode} />
      <TestBotDrawer nodes={nodes} edges={edges} />
      <div className="h-[88vh] w-full flex">
        <div className="flex-1 relative">
          <div className="p-4 border-b bg-white shadow-sm flex justify-between items-center">
            <h1 className="text-xl font-bold">Studio – {botName}</h1>
          </div>

          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
