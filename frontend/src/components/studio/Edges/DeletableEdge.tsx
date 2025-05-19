// src/components/studio/Edges/DeletableEdge.tsx
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "reactflow";
import { X } from "lucide-react";

const DeletableEdge = (props: EdgeProps) => {
  const { id, sourceX, sourceY, targetX, targetY, markerEnd, selected, data } =
    props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
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
            background: "transparent",
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
          <X className="w-3 h-3 text-white" />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default DeletableEdge;
