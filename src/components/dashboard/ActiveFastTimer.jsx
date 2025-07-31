
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Timer, Square } from "lucide-react";
import VideoBackgroundAnimation from "../timer/VideoBackgroundAnimation";

export default function ActiveFastTimer({ fast, onUpdate }) {
  const [timerData, setTimerData] = useState({
    elapsedTime: "00:00:00",
    progress: 0
  });

  useEffect(() => {
    if (!fast) return;

    const updateTimer = () => {
      const startTime = new Date(fast.start_time).getTime();
      const targetDuration = fast.duration_hours * 3600;
      const currentTime = new Date().getTime();

      const elapsedTime = Math.max(0, Math.floor((currentTime - startTime) / 1000));
      const progress = Math.min(100, (elapsedTime / targetDuration) * 100);

      const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      setTimerData({
        elapsedTime: formatTime(elapsedTime),
        progress: progress
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [fast]);

  const getTypeLabel = (type, protocol) => {
    if (type === 'intermittent' && protocol) return protocol;
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="bg-black/20 backdrop-blur-md border border-white/10 overflow-hidden relative">
      {/* Video Animation Background */}
      <VideoBackgroundAnimation />
      
      <CardContent className="p-8 relative z-10">
        <div className="text-center space-y-6">
          {/* Timer Circle */}
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-border"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="hsl(var(--accent-dark))"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - timerData.progress / 100)}`}
                className="transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {timerData.elapsedTime}
                </div>
                <div className="text-sm text-foreground/70 uppercase tracking-wide">
                  {getTypeLabel(fast.type, fast.protocol)}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="text-center">
            <div className="text-lg text-foreground/90 mb-2">
              {Math.round(timerData.progress)}% Complete
            </div>
            <div className="text-sm text-foreground/60">
              Target: {fast.duration_hours}h
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
