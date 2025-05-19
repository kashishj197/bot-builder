import { useParams } from "react-router-dom";

const Studio = () => {
  const { bot_id } = useParams();

  return <div>Studio for Bot ID: {bot_id}</div>;
};
export default Studio;
