import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FastTypeCard({ type, isSelected, onSelect }) {
  const getSafetyBadge = (level) => {
    const badges = {
      low: { text: "Beginner Friendly", class: "bg-green-500/20 text-green-400 border-green-500/30" },
      medium: { text: "Intermediate", class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      high: { text: "Advanced Only", class: "bg-red-500/20 text-red-400 border-red-500/30" }
    };
    return badges[level];
  };

  const safetyBadge = getSafetyBadge(type.safetyLevel);

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isSelected 
          ? 'ring-2 ring-blue-500 glass-morphism border-blue-500/30' 
          : 'hover:border-slate-700 glass-morphism border-slate-800'
      }`}
      onClick={() => onSelect(type.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${type.bgGradient} flex items-center justify-center border border-slate-700/50`}>
            <type.icon className={`w-7 h-7 bg-gradient-to-r ${type.gradient} bg-clip-text text-transparent`} />
          </div>
          <Badge className={`${safetyBadge.class} border text-xs`}>
            {safetyBadge.text}
          </Badge>
        </div>
        
        <h3 className="text-xl font-medium text-slate-100 mb-3">{type.name}</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{type.description}</p>
        
        {type.protocols && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-300">Popular Protocols:</p>
            <div className="flex flex-wrap gap-2">
              {type.protocols.map((protocol) => (
                <Badge key={protocol} variant="outline" className="text-xs border-slate-600 text-slate-400">
                  {protocol}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {type.durations && (
          <div className="mt-4">
            <p className="text-sm text-slate-500">
              Duration: {type.durations[0]}h - {type.durations[type.durations.length - 1]}h
            </p>
          </div>
        )}
        
        {isSelected && (
          <div className="mt-6 p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
            <p className="text-sm text-blue-400 font-medium">✓ Selected</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}