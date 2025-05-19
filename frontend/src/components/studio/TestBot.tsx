import { useEffect, useState } from "react";
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
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState("");

  const findNextNode = (id: string): Node | null => {
    const nextEdge = edges.find((e) => e.source === id);
    return nodes.find((n) => n.id === nextEdge?.target) || null;
  };

  useEffect(() => {
    setMessages([]);
    setCurrentNodeId(null);
  }, [open]);

  const handleNext = (node: Node | null, startAt: number = 0) => {
    if (!node || !node.data?.cards) {
      setCurrentNodeId(null);
      return;
    }

    for (let i = startAt; i < node.data.cards.length; i++) {
      const card = node.data.cards[i];

      if (card.type === "message") {
        setMessages((prev) => [...prev, { text: card.content, from: "bot" }]);
        setCurrentNodeId(node.id);
        setCurrentCardIndex(i + 1); // ready to process next
      }

      if (card.type === "user_input") {
        setCurrentNodeId(node.id);
        setCurrentCardIndex(i); // pause and wait
        return;
      }

      //   if (card.type === "end") {
      //     // Reset state
      //     setMessages((prev) => [
      //       ...prev,
      //       { text: card.content || "Session ended.", from: "bot" },
      //     ]);
      //     setCurrentNodeId(null);
      //     setCurrentCardIndex(0);
      //     return;
      //   }
    }

    // If finished all cards, move to next node
    const next = findNextNode(node.id);
    setCurrentCardIndex(0);
    handleNext(next);
  };

  const handleSend = () => {
    if (!currentNodeId || !userInput.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: userInput, from: "user" }]);
    setUserInput("");

    const currentNode = nodes.find((n) => n.id === currentNodeId);
    const cards = currentNode?.data?.cards || [];
    const nextCardIndex = currentCardIndex + 1;

    // Reset interaction state
    setCurrentCardIndex(nextCardIndex);
    setCurrentNodeId(null);

    // If the next card exists and is "end", handle directly
    if (nextCardIndex < cards.length && cards[nextCardIndex].type === "end") {
      setMessages((prev) => [
        ...prev,
        { text: cards[nextCardIndex].content || "Session ended.", from: "bot" },
      ]);
      setCurrentCardIndex(0);
      return;
    }

    // Otherwise, resume from the next card in the same node
    handleNext(currentNode!, nextCardIndex);
  };

  const handleStart = () => {
    setMessages([]);
    setCurrentCardIndex(0);
    setCurrentNodeId(null);

    const start = nodes.find((n) => n.data.type === "start") || nodes[0];
    const next = findNextNode(start.id);
    handleNext(next);
  };

  const modify = (text: string, lastInput: string): string => {
    if (!text) return "";
    return text.replaceAll("{{event.preview}}", lastInput);
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="h-screen max-w-sm ml-auto p-4 flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Test Your Bot</DrawerTitle>
        </DrawerHeader>

        <div className="h-[60vh] overflow-y-auto border p-4 mb-4 space-y-2 rounded-md bg-muted">
          {messages.map((m, idx) => {
            const lastUserMessage =
              messages
                .slice(0, idx) // use only previous messages
                .reverse()
                .find((msg) => msg.from === "user")?.text || "";

            return (
              <div
                key={idx}
                className={`dark:bg-zinc text-sm ${m.from === "bot" ? "text-left" : "text-right"}`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    m.from === "bot" ? "bg-zinc-800" : "bg-blue-600 text-white"
                  }`}
                >
                  {m.from === "bot" ? modify(m.text, lastUserMessage) : m.text}
                </span>
              </div>
            );
          })}
        </div>

        {currentNodeId && (
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your reply..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        )}

        {!messages.length && !currentNodeId && (
          <Button className="w-full mt-4" onClick={handleStart}>
            Start Test
          </Button>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default TestBotDrawer;
