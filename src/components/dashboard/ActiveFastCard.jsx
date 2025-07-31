import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FastingSession } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Timer, Square, Activity } from "lucide-react";
import { format } from "date-fns";

export default function ActiveFastCard({ fast, onUpdate }) {
  const [timerData, setTimerData] = useState({
    elapsedTime: "00:00:00",
    timeRemaining: "00:00:00",
    progress: 0
  });

  useEffect(() => {
    if (!fast) return;

    const updateTimer = () => {
      const startTime = new Date(fast.start_time).getTime();
      const targetDuration = fast.duration_hours * 3600;
      const currentTime = new Date().getTime();

      const elapsedTime = Math.max(0, Math.floor((currentTime - startTime) / 1000));
      const remainingTime = Math.max(0, targetDuration - elapsedTime);
      const progress = Math.min(100, (elapsedTime / targetDuration) * 100);

      const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      setTimerData({
        elapsedTime: formatTime(elapsedTime),
        timeRemaining: formatTime(remainingTime),
        progress: progress
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [fast]);

  const handleStopFast = async () => {
    if (fast) {
      await FastingSession.update(fast.id, {
        status: 'stopped',
        actual_end_time: new Date().toISOString()
      });
      onUpdate();
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      water: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      dry: "bg-orange-500/20 text-orange-400 border-orange-500/30", 
      intermittent: "bg-green-500/20 text-green-400 border-green-500/30",
      alternate_day: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    };
    return colors[type] || "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  const getTypeLabel = (type, protocol) => {
    if (type === 'intermittent' && protocol) return protocol;
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="glass-morphism border-slate-800 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-0.5">
        <div className="bg-slate-900 rounded-t-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl text-slate-200 font-medium">
                <Activity className="w-6 h-6 text-blue-400" />
                Active Fast
              </CardTitle>
              <Badge className={`${getTypeColor(fast.type)} border`}>
                {getTypeLabel(fast.type, fast.protocol)}
              </Badge>
            </div>
          </CardHeader>
        </div>
      </div>
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - timerData.progress / 100)}`}
                className="text-blue-500 transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-mono font-light text-slate-100">{timerData.elapsedTime}</div>
                <div className="text-sm text-slate-400">elapsed</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-xl font-light text-slate-300 mb-1">
                {Math.round(timerData.progress)}% Complete
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${timerData.progress}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-slate-400">
              Started {format(new Date(fast.start_time), 'h:mm a')}
            </p>
            <p className="text-sm text-slate-500">
              Target: {fast.duration_hours}h • Remaining: {timerData.timeRemaining}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link to={createPageUrl("ActiveTimer")} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl py-3 font-medium">
              <Timer className="w-4 h-4 mr-2" />
              View Timer
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleStopFast}
            className="border-slate-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 rounded-xl px-6"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}