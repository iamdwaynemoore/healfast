import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Target, Award } from "lucide-react";

export default function QuickStats({ streakCount, totalHours, completedFasts, averageDuration }) {
  const stats = [
    {
      title: "Current Streak",
      value: `${streakCount}`,
      unit: "days",
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10"
    },
    {
      title: "Total Hours",
      value: `${Math.round(totalHours)}`,
      unit: "hours",
      icon: Clock,
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-500/10 to-indigo-500/10"
    },
    {
      title: "Completed",
      value: completedFasts,
      unit: "fasts",
      icon: Target,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      title: "Average",
      value: `${Math.round(averageDuration || 0)}`,
      unit: "hours",
      icon: Award,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-morphism border-slate-800 hover:border-slate-700 transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.bgGradient} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-400">{stat.title}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-light text-slate-100">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.unit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}