import { Handle, Position } from "reactflow";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Button } from "@radix-ui/themes";

const StandardNode = ({ id, data }: any) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="rounded bg-white dark:bg-zinc-800 p-3 w-48 shadow text-sm relative">
          <div className="font-bold text-zinc-700 dark:text-white mb-2">
            Standard Node
          </div>

          {data.cards.map((card: any, i: number) => (
            <div
              key={i}
              className="border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 p-1 text-xs rounded mb-1 text-zinc-800 dark:text-zinc-200"
            >
              {card.type}: {card.content}
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
