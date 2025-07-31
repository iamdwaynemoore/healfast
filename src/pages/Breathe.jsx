import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import Logo from '@/components/Logo';

export default function Breathe() {
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
  const [currentRound, setCurrentRound] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const phaseTimerRef = useRef(null);
  const navigate = useNavigate();

  // 4-7-8 breathing pattern
  const breathingPattern = {
    inhale: 4,
    hold: 7,
    exhale: 8
  };

  const totalRounds = 4;

  useEffect(() => {
    if (isActive && currentRound < totalRounds) {
      phaseTimerRef.current = setInterval(() => {
        setSecondsElapsed(prev => {
          const nextSecond = prev + 1;
          const currentPhaseDuration = breathingPattern[phase];
          
          if (nextSecond >= currentPhaseDuration) {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold');
            } else if (phase === 'hold') {
              setPhase('exhale');
            } else {
              // Complete one round
              setPhase('inhale');
              setCurrentRound(r => r + 1);
            }
            return 0;
          }
          
          return nextSecond;
        });
      }, 1000);

      return () => clearInterval(phaseTimerRef.current);
    } else if (currentRound >= totalRounds && isActive) {
      // Session complete
      setIsActive(false);
    }
  }, [isActive, phase, currentRound]);

  const startSession = () => {
    setIsActive(true);
    setCurrentRound(0);
    setPhase('inhale');
    setSecondsElapsed(0);
  };

  const stopSession = () => {
    setIsActive(false);
    setCurrentRound(0);
    setPhase('inhale');
    setSecondsElapsed(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return '';
    }
  };

  const progress = (secondsElapsed / breathingPattern[phase]) * 100;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover opacity-20"
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
        {/* Header */}
        <div className="p-6 pt-12">
          {/* Logo at top */}
          <div className="text-center mb-6">
            <Logo size="sm" className="opacity-40" />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="text-white/60 hover:text-white transition-all duration-300"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="text-center">
              <div className="text-white/40 text-xs font-light tracking-[0.3em] uppercase">
                4-7-8 Breathing
              </div>
            </div>

            <div className="w-6" />
          </div>
        </div>

        {/* Breathing Visual */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-12 w-full max-w-md">
            {!isActive && currentRound === 0 ? (
              // Start Screen
              <div className="space-y-8">
                <div className="text-white/60 text-sm font-light leading-relaxed max-w-xs mx-auto">
                  A calming breath technique that helps reduce anxiety and promotes relaxation
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-8 text-white/40 text-sm">
                    <div>Inhale <span className="text-white/60">4s</span></div>
                    <div>Hold <span className="text-white/60">7s</span></div>
                    <div>Exhale <span className="text-white/60">8s</span></div>
                  </div>
                </div>

                <button
                  onClick={startSession}
                  className="w-48 mx-auto py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-full font-light tracking-wider uppercase text-sm transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Begin Session
                </button>
              </div>
            ) : currentRound >= totalRounds ? (
              // Complete Screen
              <div className="space-y-8">
                <div className="text-white text-2xl font-light">
                  Session Complete
                </div>
                <div className="text-white/60 text-sm font-light">
                  You've completed {totalRounds} rounds of mindful breathing
                </div>
                <button
                  onClick={startSession}
                  className="w-48 mx-auto py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-full font-light tracking-wider uppercase text-sm transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Again
                </button>
              </div>
            ) : (
              // Active Session
              <>
                {/* Breathing Circle */}
                <div className="relative w-64 h-64 mx-auto">
                  {/* Background Circle */}
                  <div className="absolute inset-0 rounded-full border border-white/10" />
                  
                  {/* Animated Circle */}
                  <div 
                    className={`absolute inset-0 rounded-full border-2 border-white/40 transition-all duration-[4000ms] ease-in-out ${
                      phase === 'inhale' ? 'scale-100' : phase === 'hold' ? 'scale-100' : 'scale-75'
                    }`}
                    style={{
                      transitionDuration: phase === 'inhale' ? '4000ms' : phase === 'exhale' ? '8000ms' : '0ms'
                    }}
                  />
                  
                  {/* Center Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white text-2xl font-light mb-2">
                        {getPhaseInstruction()}
                      </div>
                      <div className="text-white/60 text-6xl font-light tabular-nums">
                        {breathingPattern[phase] - secondsElapsed}
                      </div>
                    </div>
                  </div>

                  {/* Progress Ring */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 58}`}
                      strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
                      className="text-white/30 transition-all duration-1000 ease-linear"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Round Counter */}
                <div className="text-white/40 text-sm font-light">
                  Round {currentRound + 1} of {totalRounds}
                </div>

                {/* Stop Button */}
                <button
                  onClick={stopSession}
                  className="w-32 mx-auto py-3 bg-transparent border border-white/20 text-white/60 rounded-full text-sm font-light transition-all duration-300 hover:bg-white/5 hover:border-white/30"
                >
                  End Session
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
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

            {/* Breathe - Active */}
            <button
              className="p-3 text-white/80 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.3" fill="none"/>
              </svg>
            </button>

            {/* Timer */}
            <button
              onClick={() => navigate(createPageUrl("ActiveTimer"))}
              className="p-3 text-white/40 hover:text-white/60 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
    </div>
  );
}