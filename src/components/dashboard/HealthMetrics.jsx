import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Smartphone } from "lucide-react";

export default function HealthMetrics({ profile }) {
  const getHealthStatus = () => {
    if (!profile) return "No data";
    
    if (profile.height && profile.weight) {
      const heightInM = profile.height / 100;
      const bmi = profile.weight / (heightInM * heightInM);
      
      if (bmi < 18.5) return "Underweight";
      if (bmi < 25) return "Normal";
      if (bmi < 30) return "Overweight";
      return "Obese";
    }
    
    return "Incomplete profile";
  };

  const getBMI = () => {
    if (!profile?.height || !profile?.weight) return null;
    const heightInM = profile.height / 100;
    return (profile.weight / (heightInM * heightInM)).toFixed(1);
  };

  return (
    <Card className="glass-morphism border-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-slate-200 font-medium">
          <Activity className="w-5 h-5 text-blue-400" />
          Health Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium text-slate-300">Health Status</span>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            {getHealthStatus()}
          </Badge>
        </div>

        {getBMI() && (
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <span className="text-sm font-medium text-slate-300">BMI</span>
            <span className="font-medium text-slate-200">{getBMI()}</span>
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Apple Health</span>
          </div>
          <Badge className={profile?.apple_health_connected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}>
            {profile?.apple_health_connected ? "Connected" : "Not Connected"}
          </Badge>
        </div>

        {profile?.primary_goal && (
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20">
            <p className="text-sm font-medium text-slate-300 mb-2">Primary Goal</p>
            <p className="text-sm text-blue-400 capitalize">
              {profile.primary_goal.replace('_', ' ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}