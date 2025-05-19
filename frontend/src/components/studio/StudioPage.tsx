import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
import StandardNode from "./Nodes/StandardNode";
import NodeComponentDrawer from "./NodeSidebar";
import { Button } from "../ui/button";

interface StudioPageProps {
  botId: string;
}

const StudioPage: React.FC<StudioPageProps> = ({ botId }) => {
  const nodeTypes = useMemo(
    () => ({ default: CustomNode, standard: StandardNode }),
    []
  );
  const edgeTypes = useMemo(
    () => ({
      deletable: DeletableEdge,
    }),
    []
  );
  const dispatch = useAppDispatch();
  const { nodes, edges } = useAppSelector((state: RootState) => state.flow);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [openTestBot, setOpenTestBot] = useState(false);
  // const reactFlowInstance = useReactFlow();

  const [contextPosition, setContextPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const handleAddComponent = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleInsertCard = (type: "message" | "user_input") => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNodeId) {
        const newCards = [...(node.data.cards || []), { type, content: "" }];
        return { ...node, data: { ...node.data, cards: newCards } };
      }
      return node;
    });

    dispatch(updateNodes(updatedNodes));
    debouncedSave(updatedNodes, edges);
    setSelectedNodeId(null);
  };

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

  const handleAddStandardNode = ({ x, y }: { x: number; y: number }) => {
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();

    const position = bounds
      ? {
          x: x - bounds.left,
          y: y - bounds.top,
        }
      : {
          x: 100,
          y: 100,
        }; // fallback default

    const newNode = {
      id: nanoid(),
      type: "standard",
      position,
      data: { cards: [] },
    };

    dispatch(updateNodes([...nodes, newNode]));
    debouncedSave([...nodes, newNode], edges);
  };

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

  const nodesWithDelete = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onAddComponent: handleAddComponent,
      onDelete: (id: string) => {
        const filteredNodes = nodes.filter((n) => n.id !== id);
        const filteredEdges = edges.filter(
          (e) => e.source !== id && e.target !== id
        );
        dispatch(updateNodes(filteredNodes));
        dispatch(updateEdges(filteredEdges));
        debouncedSave(filteredNodes, filteredEdges);
      },
      updateCardContent: (
        nodeId: string,
        cardIndex: number,
        newContent: string
      ) => {
        const updatedNodes = nodes.map((n) => {
          if (n.id === nodeId) {
            const updatedCards = n.data.cards.map((card: any, idx: number) =>
              idx === cardIndex ? { ...card, content: newContent } : card
            );
            return {
              ...n,
              data: {
                ...n.data,
                cards: updatedCards,
              },
            };
          }
          return n;
        });

        dispatch(updateNodes(updatedNodes));
        debouncedSave(updatedNodes, edges);
      },
    },
  }));

  // const onAddNode = (type: "message" | "user_input") => {
  //   const newNode: Node = {
  //     id: nanoid(),
  //     type: "default",
  //     position: {
  //       x: Math.random() * 300 + 100,
  //       y: Math.random() * 300 + 100,
  //     },
  //     data: {
  //       label: type === "message" ? "New Message" : "User Input",
  //       type,
  //     },
  //     sourcePosition: Position.Right,
  //     targetPosition: Position.Left,
  //   };
  //   dispatch(updateNodes([...nodes, newNode]));
  //   debouncedSave([...nodes, newNode], edges);
  // };

  return (
    <div className="flex">
      <NodeComponentDrawer
        open={!!selectedNodeId}
        onClose={() => setSelectedNodeId(null)}
        onAddCard={handleInsertCard}
      />
      <TestBotDrawer
        nodes={nodes}
        edges={edges}
        open={openTestBot}
        onClose={() => setOpenTestBot(false)}
      />
      <div className="h-[88vh] w-full flex" ref={reactFlowWrapper}>
        <div className="flex-1 relative">
          <div className="dark:bg-zinc-900 p-4 border-b bg-white shadow-sm flex justify-between items-center">
            <h1 className="text-xl font-bold">Studio – Bot ID: {botId}</h1>
            <Button onClick={() => setOpenTestBot(true)}>Test Bot</Button>
          </div>

          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                onContextMenu={(e) => {
                  // e.preventDefault();
                  setContextPosition({ x: e.clientX, y: e.clientY });
                }}
                className="w-full h-full"
              >
                <ReactFlow
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  nodes={nodesWithDelete}
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
            </ContextMenuTrigger>

            <ContextMenuContent className="w-48">
              <ContextMenuItem
                onClick={() => handleAddStandardNode(contextPosition)}
              >
                ➕ Add Standard Node
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
