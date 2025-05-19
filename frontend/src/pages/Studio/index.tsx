// src/pages/studio/index.tsx
import { useParams } from "react-router-dom";
import StudioPage from "@/components/studio/StudioPage";

const StudioIndex = () => {
  const { bot_id } = useParams();

  if (!bot_id) return <div className="p-4">No bot selected.</div>;

  return <StudioPage botId={bot_id} />;
};

export default StudioIndex;
