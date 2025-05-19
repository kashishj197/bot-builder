// src/components/NodeComponentDrawer.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NodeComponentDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onAddCard: (type: "message" | "user_input") => void;
}

const NodeComponentDrawer: React.FC<NodeComponentDrawerProps> = ({
  open,
  onClose,
  onAddCard,
}) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-4">
        <SheetHeader>
          <SheetTitle>Select Component</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => onAddCard("message")}
            className="w-full text-left p-2 rounded-md hover:bg-muted transition"
          >
            📝 Message
          </button>
          <button
            onClick={() => onAddCard("user_input")}
            className="w-full text-left p-2 rounded-md hover:bg-muted transition"
          >
            🔤 User Input
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeComponentDrawer;
