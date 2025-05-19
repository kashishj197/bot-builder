// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBots } from "@/features/bots/botsSlice";
import { RootState } from "@/app/store";
import BotCard from "@/components/bot/BotCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import CreateBotDialog from "@/components/bot/CreateBot";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { bots, loading, error } = useSelector(
    (state: RootState) => state.bots
  );
  const [showCreateBotDialog, setShowCreateBotDialog] = useState(false);

  const createNewBot = () => {
    setShowCreateBotDialog(true);
  };

  useEffect(() => {
    dispatch(fetchBots() as any);
  }, [dispatch]);

  return (
    <div className="p-6">
      {showCreateBotDialog && (
        <CreateBotDialog
          open={showCreateBotDialog}
          setOpen={setShowCreateBotDialog}
        />
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bots</h1>
        <Button className="cursor-pointer" onClick={() => createNewBot()}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Bot
        </Button>
      </div>

      {loading ? (
        <p>Loading bots...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots
            ? bots.map((bot) => (
                <BotCard
                  key={bot.id}
                  id={bot.id}
                  name={bot.name}
                  lastEdited={new Date(bot.updated_at).toLocaleDateString()}
                />
              ))
            : null}

          {/* Create New Bot CTA Card */}
          {bots.length === 0 ? (
            <Card
              className="border-dashed cursor-pointer"
              onClick={() => createNewBot()}
            >
              <CardContent className="flex flex-col items-center justify-center h-full py-10">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Create a new bot</h3>
                <p className="text-sm text-gray-500 text-center mb-4">
                  Start building your custom bot with our visual editor
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default DashboardPage;
