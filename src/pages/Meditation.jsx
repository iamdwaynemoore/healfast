import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Brain, Headphones, Sparkles } from 'lucide-react';
import MeditationLibrary from '@/components/meditation/MeditationLibrary';
import Logo from '@/components/Logo';

export default function Meditation() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMinutes: 0,
    sessionsCompleted: 0,
    currentStreak: 0
  });

  useEffect(() => {
    // Load meditation stats from localStorage
    const savedStats = JSON.parse(localStorage.getItem('meditation-stats') || '{}');
    setStats({
      totalMinutes: savedStats.totalMinutes || 0,
      sessionsCompleted: savedStats.sessionsCompleted || 0,
      currentStreak: savedStats.currentStreak || 0
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        {/* Animated gradient orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="sm" className="opacity-50" />
          </div>
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:bg-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              }}
            >
              <ArrowLeft className="w-4 h-4 text-white/70" />
            </button>
            <div className="flex-grow">
              <h1 className="text-3xl font-extralight text-white">Meditation Library</h1>
              <p className="text-white/40 text-sm font-light">Find your inner calm during fasting</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="backdrop-blur-md border border-white/10 rounded-2xl p-4" style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
            }}>
              <div className="flex items-center gap-2 mb-2">
                <Headphones className="w-4 h-4 text-purple-400" />
                <p className="text-white/60 text-xs">Total Minutes</p>
              </div>
              <p className="text-white text-2xl font-light">{stats.totalMinutes}</p>
            </div>
            
            <div className="backdrop-blur-md border border-white/10 rounded-2xl p-4" style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
            }}>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <p className="text-white/60 text-xs">Sessions</p>
              </div>
              <p className="text-white text-2xl font-light">{stats.sessionsCompleted}</p>
            </div>
            
            <div className="backdrop-blur-md border border-white/10 rounded-2xl p-4" style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))',
            }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <p className="text-white/60 text-xs">Day Streak</p>
              </div>
              <p className="text-white text-2xl font-light">{stats.currentStreak}</p>
            </div>
          </div>

          {/* Meditation Library Component */}
          <MeditationLibrary />
        </div>
      </div>

      {/* Navigation Footer - Ultra Minimal */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
        <div className="flex items-center justify-around max-w-lg mx-auto px-4 pb-8 pt-4">
          {/* Dashboard */}
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

          {/* Meditation - Active */}
          <button
            className="p-3 text-white/80 relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
            </div>
            <Brain className="w-5 h-5 relative z-10" />
          </button>

          {/* Community */}
          <button
            onClick={() => navigate(createPageUrl("Community"))}
            className="p-3 text-white/40 hover:text-white/60 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="8" cy="9" r="2" stroke="currentColor" strokeWidth="1"/>
              <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1"/>
              <path d="M12 14c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z" stroke="currentColor" strokeWidth="1"/>
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