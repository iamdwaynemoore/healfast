import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Settings } from "lucide-react";

export default function DurationSelector({ 
  typeData, 
  selectedDuration, 
  selectedProtocol,
  customDuration,
  onDurationChange, 
  onProtocolChange,
  onCustomDurationChange 
}) {
  return (
    <Card className="glass-morphism border-slate-700 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-slate-200 font-medium">
          <Clock className="w-5 h-5 text-blue-400" />
          Duration & Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Protocol Selection for Intermittent Fasting */}
        {typeData.id === 'intermittent' && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-300">Select Protocol</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {typeData.protocols.map((protocol, index) => (
                <Button
                  key={protocol}
                  variant={selectedProtocol === protocol ? "default" : "outline"}
                  onClick={() => {
                    onProtocolChange(protocol);
                    onDurationChange(typeData.durations[index]);
                  }}
                  className={`h-12 transition-all duration-200 ${
                    selectedProtocol === protocol 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500' 
                      : 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  {protocol}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Duration Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-300">
            {typeData.id === 'intermittent' ? 'Fasting Window' : 'Duration (Hours)'}
          </Label>
          
          {typeData.id !== 'intermittent' ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {typeData.durations.map((duration) => (
                <Button
                  key={duration}
                  variant={selectedDuration === duration ? "default" : "outline"}
                  onClick={() => onDurationChange(duration)}
                  className={`h-12 transition-all duration-200 ${
                    selectedDuration === duration 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500' 
                      : 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  {duration}h
                </Button>
              ))}
              
              {/* Custom Duration Option */}
              <Button
                variant={selectedDuration === 'custom' ? "default" : "outline"}
                onClick={() => onDurationChange('custom')}
                className={`h-12 transition-all duration-200 ${
                  selectedDuration === 'custom' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500' 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                }`}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          ) : null}

          {/* Custom Duration Input */}
          {selectedDuration === 'custom' && (
            <div className="mt-4 max-w-xs animate-in slide-in-from-top-2 duration-200">
              <Label htmlFor="custom-duration" className="text-sm font-medium text-slate-300">
                Custom Duration (Hours)
              </Label>
              <Input
                id="custom-duration"
                type="number"
                min="1"
                max={typeData.maxDuration}
                value={customDuration}
                onChange={(e) => onCustomDurationChange(e.target.value)}
                placeholder="Enter hours"
                className="mt-2 rounded-xl bg-slate-800/50 border-slate-700 text-slate-200"
              />
              <p className="text-xs text-slate-400 mt-1">
                Max: {typeData.maxDuration} hours
              </p>
            </div>
          )}
        </div>

        {/* Duration Info */}
        {selectedDuration && selectedDuration !== 'custom' && (
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-blue-300">
                {selectedDuration} Hour Fast
              </span>
            </div>
            <p className="text-sm text-blue-200/80">
              {selectedDuration <= 16 && "Great for beginners. Focus on hydration and listen to your body."}
              {selectedDuration > 16 && selectedDuration <= 24 && "Intermediate level. Consider light activities and ensure proper rest."}
              {selectedDuration > 24 && selectedDuration <= 48 && "Advanced fasting. Monitor your health closely and consider medical supervision."}
              {selectedDuration > 48 && "Extended fast requiring medical supervision. Not recommended without professional guidance."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}