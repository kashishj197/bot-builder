// src/components/studio/TestBotDrawer.tsx
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const TestBotDrawer = ({ nodes, edges }: any) => {
  const [current, setCurrent] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const start = nodes?.find((n: any) => n.id === "start");
    if (start) {
      setCurrent(start);
      setHistory([start.data.label]);
    }
  }, [nodes]);

  const handleNext = () => {
    const nextEdge = edges.find((e: any) => e.source === current.id);
    const nextNode = nodes.find((n: any) => n.id === nextEdge?.target);

    if (nextNode) {
      setHistory((h) => [...h, nextNode.data.label]);
      setCurrent(nextNode);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="absolute top-4 right-4 z-50">
          Test Bot
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen max-w-sm ml-auto p-4 flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="text-lg">Test Bot</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto space-y-2 mt-4">
          {history.map((msg, i) => (
            <div key={i} className="bg-gray-100 p-2 rounded text-sm">
              {msg}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here..."
          />
          <Button onClick={handleNext}>Send</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TestBotDrawer;
