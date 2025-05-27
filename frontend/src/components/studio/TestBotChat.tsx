import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Node, Edge } from "reactflow";

interface TestBotChatProps {
  nodes: Node[];
  edges: Edge[];
}

const TestBotChat: React.FC<TestBotChatProps> = ({ nodes, edges }) => {
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
        setCurrentCardIndex(i + 1);
      }

      if (card.type === "user_input") {
        setCurrentNodeId(node.id);
        setCurrentCardIndex(i);
        return;
      }
    }

    const next = findNextNode(node.id);
    setCurrentCardIndex(0);
    handleNext(next);
  };

  const handleSend = () => {
    if (!currentNodeId || !userInput.trim()) return;

    setMessages((prev) => [...prev, { text: userInput, from: "user" }]);
    setUserInput("");

    const currentNode = nodes.find((n) => n.id === currentNodeId);
    const cards = currentNode?.data?.cards || [];
    const nextCardIndex = currentCardIndex + 1;

    setCurrentCardIndex(nextCardIndex);
    setCurrentNodeId(null);

    if (nextCardIndex < cards.length && cards[nextCardIndex].type === "end") {
      setMessages((prev) => [
        ...prev,
        { text: cards[nextCardIndex].content || "Session ended.", from: "bot" },
      ]);
      setCurrentCardIndex(0);
      return;
    }

    handleNext(currentNode!, nextCardIndex);
  };

  const handleStart = () => {
    setMessages([]);
    setCurrentCardIndex(0);
    setCurrentNodeId(null);

    const start = nodes.find((n) => n.data.type === "start") || nodes[0];
    console.log("Starting chat with node:", nodes);
    const next = findNextNode(start.id);
    handleNext(next);
  };

  const modify = (text: string, lastInput: string): string => {
    return text.replaceAll("{{event.preview}}", lastInput);
  };

  return (
    <div className="min-h-screen w-400 flex items-center justify-center bg-gray-100 dark:bg-zinc-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 flex flex-col space-y-4">
        <div className="text-lg font-bold text-center text-zinc-800 dark:text-zinc-100">
          Chat with Test Bot
        </div>

        <div className="h-96 overflow-y-auto p-4 border rounded-md bg-zinc-100 dark:bg-zinc-700 space-y-2">
          {messages.map((m, idx) => {
            const lastUserMsg =
              messages
                .slice(0, idx)
                .reverse()
                .find((msg) => msg.from === "user")?.text || "";
            return (
              <div
                key={idx}
                className={`text-sm ${m.from === "bot" ? "text-left" : "text-right"}`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    m.from === "bot"
                      ? "bg-zinc-800 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {m.from === "bot" ? modify(m.text, lastUserMsg) : m.text}
                </span>
              </div>
            );
          })}
        </div>

        {currentNodeId ? (
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your reply..."
              className="flex-1"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        ) : (
          <Button onClick={handleStart} className="w-full">
            Start Chat
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestBotChat;
