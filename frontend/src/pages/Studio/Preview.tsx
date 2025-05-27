import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import TestBotChat from "@/components/studio/TestBotChat";
import * as React from "react";

export interface IPreviewProps {}

export default function Preview(props: IPreviewProps) {
  const { nodes, edges } = useAppSelector((state: RootState) => state.flow);
  return (
    <div className="flex justify-center items-center h-full">
      <TestBotChat nodes={nodes} edges={edges} />
    </div>
  );
}
