// src/components/studio/Edges/DeletableEdge.tsx
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import { X } from "lucide-react";

const DeletableEdge = (props: EdgeProps) => {
  const { id, sourceX, sourceY, targetX, targetY, markerEnd, selected, data } =
    props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} {...props} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
            cursor: "pointer",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "100%",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.2s",
            opacity: selected ? 1 : 0.5,
          }}
          className="hover:opacity-100"
          onClick={() => data?.onDelete?.(id)}
        >
          <X className="w-3 h-3 text-red-600" />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default DeletableEdge;
