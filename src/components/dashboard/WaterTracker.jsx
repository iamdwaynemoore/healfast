import React, { useState, useEffect } from "react";
import { UserProfile, WaterLog } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, Minus, Plus, Loader2 } from "lucide-react";
import { isToday } from "date-fns";

export default function WaterTracker() {
  const [totalCups, setTotalCups] = useState(0);
  const [goal, setGoal] = useState(8);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [todaysLogs, setTodaysLogs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!actionLoading) setLoading(true);
    try {
      const [profiles, logs] = await Promise.all([
        UserProfile.list(),
        WaterLog.list('-created_date', 100) // Get recent logs
      ]);

      const userProfile = profiles[0];
      if (userProfile && userProfile.daily_water_goal) {
        setGoal(userProfile.daily_water_goal);
      }

      const todayLogs = logs.filter(log => isToday(new Date(log.logged_at)));
      setTodaysLogs(todayLogs);
      
      const cupsToday = todayLogs.reduce((acc, log) => acc + log.quantity_cups, 0);
      setTotalCups(cupsToday);

    } catch (error) {
      console.error("Error fetching water log data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogWater = async (cups) => {
    setActionLoading(true);
    try {
      await WaterLog.create({
        quantity_cups: cups,
        logged_at: new Date().toISOString()
      });
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error logging water:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveWater = async () => {
    if (todaysLogs.length === 0) return;
    setActionLoading(true);
    try {
      const lastLog = todaysLogs[0];
      if (lastLog) {
        await WaterLog.delete(lastLog.id);
        await fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error removing water log:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const progressPercentage = goal > 0 ? (totalCups / goal) * 100 : 0;

  if (loading) {
    return (
      <Card className="bg-black/20 backdrop-blur-md border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg text-white">
            <Droplets className="w-5 h-5 text-blue-400" />
            Water Intake
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 backdrop-blur-md border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg text-white">
          <Droplets className="w-5 h-5 text-blue-400" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <span className="text-3xl font-bold text-white">{totalCups}</span>
          <span className="text-lg text-white/70"> / {goal} cups</span>
        </div>
        
        <Progress value={progressPercentage} className="h-3 bg-slate-700">
          <div className="h-full bg-blue-500" style={{ width: `${progressPercentage}%` }} />
        </Progress>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handleRemoveWater}
            disabled={actionLoading || totalCups === 0}
            className="w-12 h-12 rounded-full bg-card/50 border-border hover:bg-card disabled:opacity-50"
          >
            <Minus className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            onClick={() => handleLogWater(1)}
            disabled={actionLoading}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}