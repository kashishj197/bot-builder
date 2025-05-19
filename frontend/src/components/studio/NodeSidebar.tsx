// src/components/studio/NodeSidebar.tsx
import { Button } from "@/components/ui/button";

interface Props {
  onAddNode: (type: "message" | "user_input") => void;
}

const NodeSidebar: React.FC<Props> = ({ onAddNode }) => {
  return (
    <div className="h-screen w-60 bg-white shadow-md p-4 border-r h-full">
      <h2 className="text-lg font-bold mb-4">Add Node</h2>
      <div className="space-y-2">
        <Button className="w-full" onClick={() => onAddNode("message")}>
          ➕ Message Node
        </Button>
        <Button className="w-full" onClick={() => onAddNode("user_input")}>
          ✏️ User Input Node
        </Button>
      </div>
    </div>
  );
};

export default NodeSidebar;
