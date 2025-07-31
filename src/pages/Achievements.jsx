import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { ArrowLeft, Trophy } from 'lucide-react';
import AchievementSystem from '@/components/achievements/AchievementSystem';
import Logo from '@/components/Logo';

export default function Achievements() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-yellow-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
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
            <div>
              <h1 className="text-3xl font-extralight text-white">Your Achievements</h1>
              <p className="text-white/40 text-sm font-light">Track your milestones and earn rewards</p>
            </div>
          </div>

          {/* Achievement System */}
          {currentUser && <AchievementSystem userId={currentUser.id} />}
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

          {/* Achievements - Active */}
          <button
            className="p-3 text-white/80 relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
            </div>
            <Trophy className="w-5 h-5 relative z-10" />
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