
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Timer, Target } from "lucide-react";
import VideoBackgroundAnimation from "./VideoBackgroundAnimation";

export default function TimerDisplay({ elapsedTime, progress, activeFast, timeRemaining }) {
  return (
    <Card className="bg-black/20 backdrop-blur-md border border-white/10 overflow-hidden relative">
      {/* Video Animation Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="w-full h-full relative"
          style={{
            transform: 'translateY(-10%)'
          }}
        >
          <VideoBackgroundAnimation />
        </div>
      </div>
      
      <CardContent className="p-8 md:p-12 relative z-10">
        <div className="text-center space-y-8">
          {/* Main Timer Circle */}
          <div className="relative w-64 h-64 mx-auto">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                className="text-blue-500 transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-mono font-light text-slate-100 mb-2">
                  {elapsedTime}
                </div>
                <div className="text-slate-400 text-lg">elapsed</div>
              </div>
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="text-center">
            <div className="text-2xl font-light text-slate-300 mb-1">
              {Math.round(progress)}% Complete
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-xl font-mono font-light text-slate-200">{elapsedTime}</div>
              <div className="text-sm text-slate-400">Elapsed</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-xl font-light text-slate-200">{activeFast.duration_hours}h</div>
              <div className="text-sm text-slate-400">Target</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Timer className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-xl font-mono font-light text-slate-200">{timeRemaining}</div>
              <div className="text-sm text-slate-400">Remaining</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
