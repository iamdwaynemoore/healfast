import React, { useState, useEffect } from "react";
import { FastingSession } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { differenceInSeconds } from "date-fns";
import Logo from "@/components/Logo";

export default function ActiveTimer() {
  const navigate = useNavigate();
  const [activeFast, setActiveFast] = useState(null);
  const [timerData, setTimerData] = useState({
    elapsedTime: "00:00:00",
    timeRemaining: "00:00:00",
    progress: 0,
    elapsedSeconds: 0,
    elapsedHours: 0,
    elapsedMinutes: 0,
    elapsedSecondsOnly: 0
  });
  const [loading, setLoading] = useState(true);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  useEffect(() => {
    loadActiveFast();
  }, []);

  useEffect(() => {
    if (!activeFast) return;

    const updateTimer = () => {
      const now = new Date();
      const startTime = new Date(activeFast.start_time);
      const plannedEndTime = new Date(activeFast.planned_end_time);

      const elapsedSeconds = differenceInSeconds(now, startTime);
      const totalSeconds = differenceInSeconds(plannedEndTime, startTime);
      const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

      const progress = totalSeconds > 0 ? Math.min(100, (elapsedSeconds / totalSeconds) * 100) : 0;

      const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      const elapsedHours = Math.floor(elapsedSeconds / 3600);
      const elapsedMinutes = Math.floor((elapsedSeconds % 3600) / 60);
      const elapsedSecondsOnly = elapsedSeconds % 60;

      setTimerData({
        elapsedTime: formatTime(elapsedSeconds),
        timeRemaining: formatTime(remainingSeconds),
        progress: progress,
        elapsedSeconds: elapsedSeconds,
        elapsedHours: elapsedHours,
        elapsedMinutes: elapsedMinutes,
        elapsedSecondsOnly: elapsedSecondsOnly
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeFast]);

  const loadActiveFast = async () => {
    try {
      const sessions = await FastingSession.list('-created_at', 10);
      const active = sessions.find(s => s.status === 'active');

      if (!active) {
        navigate(createPageUrl("Dashboard"));
        return;
      }

      setActiveFast(active);
    } catch (error) {
      console.error('Error loading active fast:', error);
      alert(`Error loading timer: ${error.message}`);
      navigate(createPageUrl("Dashboard"));
    } finally {
      setLoading(false);
    }
  };

  const handleStopFast = async () => {
    if (activeFast) {
      const status = timerData.progress >= 100 ? 'completed' : 'stopped';
      await FastingSession.update(activeFast.id, {
        status: status,
        actual_end_time: new Date().toISOString()
      });
      navigate(createPageUrl("Dashboard"));
    }
  };

  const getFastingPhase = () => {
    const hours = timerData.elapsedHours;
    if (hours < 4) return { phase: "INITIATION", description: "Body adjusting" };
    if (hours < 12) return { phase: "ADAPTATION", description: "Entering ketosis" };
    if (hours < 24) return { phase: "OPTIMIZATION", description: "Fat burning mode" };
    if (hours < 48) return { phase: "DEEP KETOSIS", description: "Cellular renewal" };
    return { phase: "AUTOPHAGY", description: "Peak performance" };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white/30 text-xl font-light tracking-widest animate-pulse">LOADING</div>
      </div>
    );
  }

  if (!activeFast) {
    return null;
  }

  const currentPhase = getFastingPhase();

  return (
    <div className="fixed inset-0 bg-black overflow-y-auto">
      {/* Background Video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          className="min-w-full min-h-full object-contain opacity-10"
          style={{
            transform: 'scale(1.2)',
            filter: 'blur(16px)'
          }}
          src="/water-swirl.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header - Minimal and Elegant */}
        <div className="flex items-center justify-between p-6 pt-12">
          <button
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="text-white/60 hover:text-white transition-all duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="text-center">
            <Logo size="sm" className="opacity-40" />
          </div>

          <div className="w-6" /> {/* Balance the header */}
        </div>

        {/* Timer Display - Luxury Minimalism */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-12 w-full max-w-md">
            {/* Main Timer - Large and Bold */}
            <div className="relative">
              <div className="text-white font-light tracking-wider">
                <span className="text-8xl md:text-9xl tabular-nums">
                  {timerData.elapsedHours.toString().padStart(2, '0')}
                </span>
                <span className="text-6xl md:text-7xl mx-2 animate-pulse">:</span>
                <span className="text-6xl md:text-7xl tabular-nums opacity-80">
                  {timerData.elapsedMinutes.toString().padStart(2, '0')}
                </span>
                <span className="text-4xl md:text-5xl mx-1 opacity-60 animate-pulse">:</span>
                <span className="text-3xl md:text-4xl tabular-nums opacity-40">
                  {timerData.elapsedSecondsOnly.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Progress Ring - Subtle and Elegant */}
            <div className="relative w-64 h-64 mx-auto">
              {/* Centered video effect behind the ring */}
              <div className="absolute inset-0 -m-8">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <video
                    className="w-full h-full object-cover opacity-10"
                    style={{
                      transform: 'scale(1.5)',
                    }}
                    src="/water-swirl.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>
              
              <svg className="w-64 h-64 transform -rotate-90 relative z-10" viewBox="0 0 120 120">
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
                  </linearGradient>
                  
                  {/* Moving glow gradient */}
                  <linearGradient id="movingGlow">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="20%" stopColor="#3b82f6" stopOpacity="0">
                      <animate attributeName="stopOpacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="1">
                      <animate attributeName="stopOpacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="80%" stopColor="#3b82f6" stopOpacity="0">
                      <animate attributeName="stopOpacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="transparent" />
                    <animate attributeName="x1" values="0%;100%" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="20%;120%" dur="4s" repeatCount="indefinite" />
                  </linearGradient>
                </defs>
                
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="transparent"
                  className="text-white/10"
                />
                
                {/* Main progress circle - thinner */}
                <circle
                  cx="60"
                  cy="60"
                  r="58"
                  stroke="url(#blueGradient)"
                  strokeWidth="1"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - timerData.progress / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                
                {/* Moving glow line */}
                <circle
                  cx="60"
                  cy="60"
                  r="58"
                  stroke="url(#movingGlow)"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - timerData.progress / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                  style={{
                    filter: 'blur(2px)',
                    animation: 'pulseWidth 3s ease-in-out infinite'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/60 text-sm font-light">
                  {Math.round(timerData.progress)}%
                </div>
              </div>
            </div>

            {/* Phase & Target Time */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-white/40 text-xs font-light tracking-[0.3em] uppercase">
                  {currentPhase.phase}
                </div>
                <div className="text-white/60 text-sm">
                  {currentPhase.description}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-white/40 text-xs font-light tracking-widest uppercase">
                  Target Duration
                </div>
                <div className="text-white/80 text-2xl font-light">
                  {activeFast.duration_hours} hours
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - Single, Powerful CTA */}
        <div className="p-8 pb-24">
          <button
            onClick={() => setShowStopConfirm(true)}
            className="w-full py-6 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-full font-light tracking-wider uppercase text-sm transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {timerData.progress >= 100 ? 'Complete Fast' : 'End Session'}
          </button>
        </div>

        {/* CSS for animations */}
        <style jsx>{`
          @keyframes pulseWidth {
            0%, 100% {
              stroke-width: 1;
              opacity: 0.3;
            }
            50% {
              stroke-width: 3;
              opacity: 0.8;
            }
          }
        `}</style>

        {/* Stop Confirmation Modal */}
        {showStopConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-sm w-full space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-white text-xl font-light">
                  {timerData.progress >= 100 ? 'Complete Your Fast?' : 'End Your Fast?'}
                </h3>
                <p className="text-white/60 text-sm font-light">
                  You've fasted for {timerData.elapsedTime}
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleStopFast}
                  className="w-full py-4 bg-white text-black rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {timerData.progress >= 100 ? 'Complete' : 'End Fast'}
                </button>
                <button
                  onClick={() => setShowStopConfirm(false)}
                  className="w-full py-4 bg-transparent border border-white/20 text-white rounded-full font-light transition-all duration-300 hover:bg-white/5 hover:border-white/30"
                >
                  Continue Fasting
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer - Ultra Minimal */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
        <div className="flex items-center justify-around max-w-lg mx-auto px-4 pb-8 pt-4">
          {/* Today */}
          <button
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="p-3 text-white/40 hover:text-white/60 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
          </button>

          {/* Breathe */}
          <button
            onClick={() => navigate(createPageUrl("Breathe"))}
            className="p-3 text-white/40 hover:text-white/60 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
              <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.3" fill="none"/>
            </svg>
          </button>

          {/* Timer - Active */}
          <button
            className="p-3 text-white/80 relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Nutrition */}
          <button
            onClick={() => navigate(createPageUrl("Nutrition"))}
            className="p-3 text-white/40 hover:text-white/60 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 2v7c0 6 4 10 9 10s9-4 9-10V2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <path d="M12 2v20" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate(createPageUrl("Profile"))}
            className="p-3 text-white/40 hover:text-white/60 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1"/>
              <path d="M16 20H8c-2 0-4-1-4-3s2-3 4-3h8c2 0 4 1 4 3s-2 3-4 3z" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}