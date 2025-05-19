import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Node, Edge } from "reactflow";

interface TestBotDrawerProps {
  nodes: Node[];
  edges: Edge[];
  open?: boolean;
  onClose?: () => void;
}

const TestBotDrawer: React.FC<TestBotDrawerProps> = ({
  nodes,
  edges,
  open = true,
  onClose,
}) => {
  const [messages, setMessages] = useState<
    { text: string; from: "bot" | "user" }[]
  >([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");

  const findNextNode = (id: string): Node | null => {
    const nextEdge = edges.find((e) => e.source === id);
    return nodes.find((n) => n.id === nextEdge?.target) || null;
  };

  const handleNext = (node: Node | null) => {
    if (!node) return;

    for (const card of node.data.cards || []) {
      if (card.type === "message") {
        setMessages((prev) => [...prev, { text: card.content, from: "bot" }]);
      }

      if (card.type === "user_input") {
        setCurrentNodeId(node.id); // Wait for input
        return;
      }
    }

    // If no user input, auto advance
    const next = findNextNode(node.id);
    handleNext(next);
  };

  const handleSend = () => {
    if (!currentNodeId || !userInput.trim()) return;

    setMessages((prev) => [...prev, { text: userInput, from: "user" }]);
    setUserInput("");

    const next = findNextNode(currentNodeId);
    setCurrentNodeId(null);
    handleNext(next);
  };

  const handleStart = () => {
    setMessages([]);
    const start = nodes.find((n) => n.data.type === "start") || nodes[0];
    const next = findNextNode(start.id);
    handleNext(next);
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="h-screen max-w-sm ml-auto p-4 flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Test Your Bot</DrawerTitle>
        </DrawerHeader>

        <div className="h-[60vh] overflow-y-auto border p-4 mb-4 space-y-2 rounded-md bg-muted">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`text-sm ${m.from === "bot" ? "text-left" : "text-right"}`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  m.from === "bot" ? "bg-gray-200" : "bg-blue-600 text-white"
                }`}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>

        {currentNodeId && (
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your reply..."
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        )}

        {!messages.length && (
          <Button className="w-full mt-4" onClick={handleStart}>
            Start Test
          </Button>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default TestBotDrawer;
