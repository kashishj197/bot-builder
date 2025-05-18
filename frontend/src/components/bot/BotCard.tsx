// src/features/bots/BotCard.tsx
import { Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

interface BotCardProps {
  id: string;
  name: string;
  description?: string;
  lastEdited: string;
}

const BotCard: React.FC<BotCardProps> = ({
  id,
  name,
  description,
  lastEdited,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          {name}
        </CardTitle>
        <CardDescription>Last edited: {lastEdited}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          {description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/studio/${id}`}>Edit</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to={`/studio/${id}/preview`}>
            Preview <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BotCard;
