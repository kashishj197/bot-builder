// src/components/studio/CustomNode.tsx
import { Handle, Position } from "reactflow";

const CustomNode = ({ data }: any) => {
  return (
    <div className="bg-white border rounded shadow px-4 py-2 min-w-[120px] text-center text-sm">
      <strong>{data.label}</strong>

      {data.type !== "start" && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-2 h-2 bg-blue-500"
        />
      )}

      {data.type !== "end" && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-2 h-2 bg-green-500"
        />
      )}
    </div>
  );
};

export default CustomNode;
