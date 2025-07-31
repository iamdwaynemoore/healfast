import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StreakCounter({ daysSinceLastFast, streakCount }) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Main Circle */}
          <div className="relative w-48 h-48 mx-auto">
            <div className="w-48 h-48 rounded-full border-4 border-border flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {daysSinceLastFast}
                </div>
                <div className="text-sm text-foreground/70 uppercase tracking-wide">
                  Days Since Last Fast
                </div>
              </div>
            </div>
          </div>

          {/* Streak Info */}
          <div className="text-center">
            <div className="text-lg text-foreground/90 mb-1">
              Current Streak: {streakCount} days
            </div>
            <div className="text-sm text-foreground/60">
              Keep going to build your streak!
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}