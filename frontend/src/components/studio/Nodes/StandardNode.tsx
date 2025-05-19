import { useState } from "react";
import { Handle, Position } from "reactflow";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Button } from "@radix-ui/themes";
import { Input } from "@/components/ui/input";

const StandardNode = ({ id, data }: any) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempContent, setTempContent] = useState("");

  const handleSave = (cardIndex: number) => {
    if (tempContent.trim() !== "") {
      data.updateCardContent?.(id, cardIndex, tempContent);
    }
    setEditingIndex(null);
    setTempContent("");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="node-drag-handle rounded bg-white dark:bg-zinc-800 p-3 w-48 shadow text-sm relative">
          <div className="font-bold text-zinc-700 dark:text-white mb-2">
            Standard Node
          </div>
          {data.cards.map((card: any, i: number) => (
            <div
              key={i}
              draggable
              className="nopan cursor-move border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 p-1 text-xs rounded mb-1 text-zinc-800 dark:text-zinc-200"
              onDragStart={(e) => {
                console.log("dragging", e);
                e.stopPropagation();
                e.dataTransfer.setData("cardIndex", i.toString());
              }}
              onDragOver={(e) => {
                e.preventDefault(); // required to allow drop
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.stopPropagation();
                const fromIndex = Number(e.dataTransfer.getData("cardIndex"));
                const toIndex = i;

                if (fromIndex === toIndex) return;

                const newCards = [...data.cards];
                const [moved] = newCards.splice(fromIndex, 1);
                newCards.splice(toIndex, 0, moved);

                data.updateCardOrder?.(id, newCards);
              }}
              onClick={() => {
                if (card.type === "message") {
                  setEditingIndex(i);
                  setTempContent(card.content);
                }
              }}
            >
              {editingIndex === i ? (
                <Input
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  onBlur={() => handleSave(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSave(i);
                    }
                  }}
                  autoFocus
                  className="text-xs px-1 py-0.5"
                />
              ) : (
                <span>
                  {card.type}: {card.content}
                </span>
              )}
            </div>
          ))}

          <Button
            onClick={() => data.onAddComponent?.(id)}
            className="mt-2 w-full text-xs text-blue-500 hover:underline"
          >
            ➕ Add Component
          </Button>

          <Handle
            type="target"
            position={Position.Left}
            className="w-2 h-2 bg-green-500"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="w-2 h-2 bg-blue-500"
          />
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-40">
        <ContextMenuItem
          className="text-red-500"
          onClick={() => data.onDelete?.(id)}
        >
          🗑 Delete Node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default StandardNode;
