import React, { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
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

import { RootState } from "@/app/store";
import {
  setFlow,
  updateNodes,
  updateEdges,
  saveFlow,
  setBotId,
} from "@/features/studio/flowSlice";
import { nanoid } from "nanoid";
import axios from "axios";
import debounce from "lodash.debounce";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import DeletableEdge from "./Edges/DeletableEdge";

interface StudioPageProps {
  botId: string;
}

const StudioPage: React.FC<StudioPageProps> = ({ botId }) => {
  const nodeTypes = useMemo(() => ({ default: CustomNode }), []);
  const edgeTypes = useMemo(
    () => ({
      deletable: DeletableEdge,
    }),
    []
  );
  const dispatch = useAppDispatch();
  const { nodes, edges } = useAppSelector((state: RootState) => state.flow);

  // Fetch initial flow from backend
  const fetchBotFlow = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/bots/${botId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      dispatch(setBotId(botId));

      if (!data.nodes || data.nodes.length === 0) {
        const startNode: Node = {
          id: "start",
          type: "default",
          position: { x: 100, y: 100 },
          data: { label: "Start", type: "start" },
          sourcePosition: Position.Right,
          deletable: false,
        };

        const endNode: Node = {
          id: "end",
          type: "default",
          position: { x: 600, y: 400 },
          data: { label: "End", type: "end" },
          targetPosition: Position.Left,
          deletable: false,
        };

        dispatch(setFlow({ nodes: [startNode, endNode], edges: [] }));
      } else {
        console.log("Fetched nodes:", data);
        dispatch(setFlow({ nodes: data.nodes, edges: data.edges || [] }));
      }
    } catch (error) {
      console.error("Error fetching bot flow:", error);
    }
  }, [botId, dispatch]);

  useEffect(() => {
    fetchBotFlow();
  }, [fetchBotFlow]);

  // Debounced save
  const debouncedSave = useMemo(
    () =>
      debounce((nodes, edges) => {
        dispatch(saveFlow({ botId, nodes, edges }));
      }, 1000),
    [dispatch, botId]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      const updated = applyNodeChanges(changes, nodes);
      dispatch(updateNodes(updated));
      debouncedSave(updated, edges);
    },
    [nodes, edges, dispatch, debouncedSave]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      const updated = applyEdgeChanges(changes, edges);
      dispatch(updateEdges(updated));
      debouncedSave(nodes, updated);
    },
    [nodes, edges, dispatch, debouncedSave]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      const updated = addEdge(connection, edges);
      dispatch(updateEdges(updated));
      debouncedSave(nodes, updated);
    },
    [nodes, edges, dispatch, debouncedSave]
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
    dispatch(updateNodes([...nodes, newNode]));
    debouncedSave([...nodes, newNode], edges);
  };

  return (
    <div className="flex">
      <NodeSidebar onAddNode={onAddNode} />
      <TestBotDrawer nodes={nodes} edges={edges} />
      <div className="h-[88vh] w-full flex">
        <div className="flex-1 relative">
          <div className="p-4 border-b bg-white shadow-sm flex justify-between items-center">
            <h1 className="text-xl font-bold">Studio – Bot ID: {botId}</h1>
          </div>
          <ReactFlow
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodes={nodes}
            edges={edges.map((edge) => ({
              ...edge,
              type: "deletable",
              data: {
                onDelete: (id: string) => {
                  const filtered = edges.filter((e) => e.id !== id);
                  dispatch(updateEdges(filtered));
                  debouncedSave(nodes, filtered);
                },
              },
            }))}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
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
