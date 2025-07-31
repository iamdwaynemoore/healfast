import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function MotivationalMessage({ message }) {
  return (
    <Card className="glass-morphism border-slate-800 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <Star className="w-6 h-6 text-yellow-400" />
          <Star className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-lg text-slate-200 font-medium">{message}</p>
        <p className="text-sm text-slate-400 mt-2">Keep going! Your body is adapting and healing.</p>
      </CardContent>
    </Card>
  );
}