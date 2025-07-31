import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Heart, Zap, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function FastingStats({ activeFast, elapsedSeconds }) {
  const getHealthBenefits = () => {
    const elapsedHours = Math.floor(elapsedSeconds / 3600);
    
    const benefits = [
      { time: 4, text: "Glycogen stores depleting", active: elapsedHours >= 4 },
      { time: 8, text: "Growth hormone increasing", active: elapsedHours >= 8 },
      { time: 12, text: "Insulin sensitivity improving", active: elapsedHours >= 12 },
      { time: 16, text: "Fat burning accelerating", active: elapsedHours >= 16 },
      { time: 24, text: "Autophagy beginning", active: elapsedHours >= 24 },
      { time: 48, text: "Deep autophagy active", active: elapsedHours >= 48 },
      { time: 72, text: "Immune system regeneration", active: elapsedHours >= 72 }
    ];

    return benefits;
  };

  const stats = [
    {
      title: "Hydration",
      value: activeFast.type === 'dry' ? "Restricted" : "Water Only",
      icon: Droplets,
      color: activeFast.type === 'dry' ? "text-orange-400" : "text-blue-400"
    },
    {
      title: "Autophagy",
      value: Math.floor(elapsedSeconds / 3600) >= 24 ? "Active" : "Building",
      icon: Zap,
      color: "text-purple-400"
    },
    {
      title: "Started",
      value: format(new Date(activeFast.start_time), 'h:mm a'),
      icon: Calendar,
      color: "text-green-400"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Current Stats */}
      <Card className="glass-morphism border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200 font-medium">Current Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-slate-300 font-medium">{stat.title}</span>
              </div>
              <span className="text-slate-200">{stat.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Health Benefits Timeline */}
      <Card className="glass-morphism border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-200 font-medium flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Health Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getHealthBenefits().map((benefit, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  benefit.active 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-slate-800/30'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  benefit.active ? 'bg-green-400' : 'bg-slate-600'
                }`}></div>
                <div className="flex-1">
                  <span className={`text-sm ${
                    benefit.active ? 'text-green-300' : 'text-slate-400'
                  }`}>
                    {benefit.time}h: {benefit.text}
                  </span>
                </div>
                {benefit.active && (
                  <div className="text-green-400 text-xs">✓</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}