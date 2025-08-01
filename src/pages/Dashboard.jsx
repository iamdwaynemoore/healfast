import React, { useState, useEffect } from "react";
import { FastingSession, UserProfile, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { differenceInHours, startOfWeek, addDays, isSameDay, format, isToday } from "date-fns";
import { Droplets, Edit2, MoreVertical, Trophy, SmilePlus, Sparkles } from "lucide-react";
import SmartCoach from "@/components/dashboard/SmartCoach";
import MoodJournal from "@/components/journal/MoodJournal";
import Logo from "@/components/Logo";
import { getDailyWisdom } from "@/data/wisdom";

export default function Dashboard() {
  const [activeFast, setActiveFast] = useState(null);
  const [recentFasts, setRecentFasts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waterCups, setWaterCups] = useState(0);
  const [editingFast, setEditingFast] = useState(null);
  const [showWaterAnimation, setShowWaterAnimation] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMoodJournal, setShowMoodJournal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
    // Load water from localStorage
    const today = format(new Date(), 'yyyy-MM-dd');
    const savedWater = localStorage.getItem(`water-${today}`);
    if (savedWater) {
      setWaterCups(parseInt(savedWater));
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const [sessions, userProfile, user] = await Promise.all([
        FastingSession.list('-created_at', 10),
        UserProfile.list(),
        User.me()
      ]);

      setCurrentUser(user);
      const active = sessions.find(s => s.status === 'active');
      setActiveFast(active);
      setRecentFasts(sessions.filter(s => s.status !== 'active'));
      setProfile(userProfile[0]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWater = () => {
    if (waterCups < 16) {
      const newCount = waterCups + 1;
      setWaterCups(newCount);
      setShowWaterAnimation(true);
      
      // Save to localStorage
      const today = format(new Date(), 'yyyy-MM-dd');
      localStorage.setItem(`water-${today}`, newCount.toString());
      
      setTimeout(() => setShowWaterAnimation(false), 3000);
    }
  };

  const removeWater = () => {
    if (waterCups > 0) {
      const newCount = waterCups - 1;
      setWaterCups(newCount);
      const today = format(new Date(), 'yyyy-MM-dd');
      localStorage.setItem(`water-${today}`, newCount.toString());
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getStreakCount = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < recentFasts.length; i++) {
      const fastDate = new Date(recentFasts[i].start_time);
      const daysDiff = Math.floor((today - fastDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getElapsedTime = () => {
    if (!activeFast) return { hours: 0, minutes: 0 };
    const now = new Date();
    const start = new Date(activeFast.start_time);
    const totalMinutes = Math.floor((now - start) / 60000);
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  };

  const handleEditFast = (fast) => {
    setEditingFast(fast);
    // In a real app, this would open a modal or navigate to an edit page
  };

  const deleteFast = async (fastId) => {
    try {
      await FastingSession.delete(fastId);
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting fast:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white/30 text-xl font-light tracking-widest animate-pulse">LOADING</div>
      </div>
    );
  }

  const elapsedTime = getElapsedTime();
  const userName = profile?.full_name?.split(' ')[0] || 'Friend';

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
        <div className="p-6 pt-8">
          {/* Logo and greeting combined */}
          <div className="flex items-center justify-between mb-4">
            <Logo size="sm" className="opacity-60" />
            
            {/* Achievement Button */}
            <button
              onClick={() => navigate(createPageUrl("Achievements"))}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all hover:scale-110"
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
              {/* New achievement indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            </button>
          </div>
          
          <div className="text-center">
            <div className="text-white/40 text-xs font-light tracking-[0.3em] uppercase mb-1">
              {getGreeting()}
            </div>
            <h1 className="text-white text-2xl font-light">
              {userName}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="max-w-md mx-auto space-y-8">
            {/* Active Fast or Start Fast */}
            {activeFast ? (
              <button
                onClick={() => navigate(createPageUrl("ActiveTimer"))}
                className="w-full relative overflow-hidden rounded-3xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="relative z-10">
                  <div className="text-white/60 text-xs font-light tracking-widest uppercase mb-4">
                    Active Fast
                  </div>
                  <div className="text-white text-5xl font-light tabular-nums">
                    {elapsedTime.hours.toString().padStart(2, '0')}:{elapsedTime.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-white/40 text-sm mt-2">
                    {activeFast.duration_hours}h goal
                  </div>
                  <div className="w-full h-[1px] bg-white/10 mt-6 mb-4" />
                  <div className="text-white/60 text-xs uppercase tracking-wider">
                    Tap to view timer
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => navigate(createPageUrl("StartFast"))}
                className="w-full relative overflow-hidden rounded-3xl p-12 bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-white/20 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="text-white text-xl font-light mb-2">
                    Begin Your Fast
                  </div>
                  <div className="text-white/40 text-xs uppercase tracking-wider">
                    Start your journey
                  </div>
                </div>
              </button>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Streak */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-white/60 text-xs font-light tracking-widest uppercase mb-3">
                  Streak
                </div>
                <div className="text-white text-3xl font-light">
                  {getStreakCount()}
                </div>
                <div className="text-white/40 text-xs mt-1">
                  days
                </div>
              </div>

              {/* Water Tracking with Animation */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="text-white/60 text-xs font-light tracking-widest uppercase mb-3 flex items-center justify-between">
                  <span>Hydration</span>
                  <Droplets className="w-3 h-3" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-3xl font-light tabular-nums">
                      {waterCups}
                    </div>
                    <div className="text-white/40 text-xs mt-1">
                      {waterCups >= 16 ? '1 gallon!' : `of 16 cups`}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={removeWater}
                      disabled={waterCups === 0}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={addWater}
                      disabled={waterCups >= 16}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Water Wave Animation */}
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                  <div 
                    className="absolute bottom-0 left-0 right-0 transition-all ease-out"
                    style={{ 
                      height: `${(waterCups / 16) * 100}%`,
                      maxHeight: '100%',
                      transitionDuration: showWaterAnimation ? '1500ms' : '700ms'
                    }}
                  >
                    {/* Multi-layer Gradient Background */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-700/30 via-blue-600/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-transparent" />
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(ellipse at center bottom, rgba(59, 130, 246, ${0.1 + (waterCups * 0.015)}), transparent 70%)`,
                        }}
                      />
                    </div>
                    
                    {/* Dynamic Wave Layers based on water level */}
                    {[...Array(Math.min(Math.ceil(waterCups / 4), 4))].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute left-0 right-0"
                        style={{
                          top: `${i * 15}px`,
                          height: '35px',
                          background: `linear-gradient(to bottom, rgba(59, 130, 246, ${0.3 - (i * 0.05)}), transparent)`,
                          borderRadius: '45% 55% 0 0',
                          transform: showWaterAnimation ? `translateY(-${10 - i * 2}px) scaleY(1.1)` : 'translateY(0) scaleY(1)',
                          transition: 'transform 0.8s ease-out',
                          animation: `waterWave${i} ${3 + i * 0.5}s ease-in-out infinite`,
                          animationDelay: `${i * 0.3}s`
                        }}
                      />
                    ))}
                    
                    {/* Dramatic Splash Effect on Add */}
                    {showWaterAnimation && (
                      <>
                        {/* Main Splash */}
                        <div 
                          className="absolute top-0 left-1/2 -translate-x-1/2"
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 60%)',
                            animation: 'splash 1.5s ease-out',
                            transform: 'translate(-50%, -20px)'
                          }}
                        />
                        
                        {/* Ripple Rings */}
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute top-0 left-1/2 -translate-x-1/2"
                            style={{
                              width: `${80 + i * 40}px`,
                              height: `${80 + i * 40}px`,
                              borderRadius: '50%',
                              border: `2px solid rgba(59, 130, 246, ${0.4 - i * 0.1})`,
                              animation: `ripple ${1.5 + i * 0.3}s ease-out`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                        
                        {/* Bubble Particles */}
                        {waterCups > 8 && [...Array(5)].map((_, i) => (
                          <div
                            key={`bubble-${i}`}
                            className="absolute"
                            style={{
                              left: `${30 + i * 10}%`,
                              bottom: '0',
                              width: `${4 + i * 2}px`,
                              height: `${4 + i * 2}px`,
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.6)',
                              animation: `bubbleRise ${1 + i * 0.2}s ease-out`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </>
                    )}
                    
                    {/* Water Glow Effect - increases with cups */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(ellipse at center, rgba(59, 130, 246, ${waterCups * 0.02}), transparent)`,
                        filter: `blur(${waterCups * 2}px)`
                      }}
                    />
                  </div>
                </div>
                
                {/* CSS Animations */}
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes waterWave0 {
                    0%, 100% { 
                      transform: translateX(-3%) scaleY(1) rotate(-1deg);
                    }
                    33% {
                      transform: translateX(3%) scaleY(1.1) rotate(1deg);
                    }
                    66% { 
                      transform: translateX(-3%) scaleY(0.95) rotate(-0.5deg);
                    }
                  }
                  
                  @keyframes waterWave1 {
                    0%, 100% { 
                      transform: translateX(2%) scaleY(1) rotate(0.5deg);
                    }
                    33% {
                      transform: translateX(-2%) scaleY(1.08) rotate(-0.5deg);
                    }
                    66% { 
                      transform: translateX(2%) scaleY(0.97) rotate(0.5deg);
                    }
                  }
                  
                  @keyframes waterWave2 {
                    0%, 100% { 
                      transform: translateX(-2%) scaleY(1) rotate(-0.3deg);
                    }
                    50% {
                      transform: translateX(2%) scaleY(1.06) rotate(0.3deg);
                    }
                  }
                  
                  @keyframes waterWave3 {
                    0%, 100% { 
                      transform: translateX(1%) scaleY(1);
                    }
                    50% {
                      transform: translateX(-1%) scaleY(1.04);
                    }
                  }
                  
                  @keyframes splash {
                    0% {
                      transform: translate(-50%, -20px) scale(0.5);
                      opacity: 1;
                    }
                    50% {
                      transform: translate(-50%, -40px) scale(1.5);
                      opacity: 0.8;
                    }
                    100% {
                      transform: translate(-50%, -30px) scale(2);
                      opacity: 0;
                    }
                  }
                  
                  @keyframes ripple {
                    0% {
                      transform: translate(-50%, 0) scale(0);
                      opacity: 1;
                    }
                    100% {
                      transform: translate(-50%, 0) scale(1);
                      opacity: 0;
                    }
                  }
                  
                  @keyframes bubbleRise {
                    0% {
                      transform: translateY(0) scale(0);
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(-60px) scale(1);
                      opacity: 0;
                    }
                  }
                `}} />
              </div>
            </div>

            {/* Daily Wisdom */}
            <div className="backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-white/40" />
                  <h3 className="text-white/60 text-xs font-light tracking-widest uppercase">Daily Wisdom</h3>
                </div>
                <blockquote className="text-white/90 text-lg font-light leading-relaxed mb-3 italic">
                  "{getDailyWisdom().quote}"
                </blockquote>
                <p className="text-white/50 text-sm">— {getDailyWisdom().author}</p>
              </div>
            </div>

            {/* AI Smart Coach */}
            {currentUser && <SmartCoach currentUser={currentUser} />}

            {/* Mood Tracker Widget */}
            <div 
              className="backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer transition-all hover:bg-white/5 hover:scale-[1.01]"
              onClick={() => setShowMoodJournal(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white/60 text-xs font-light tracking-widest uppercase mb-2">
                    Today's Mood
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <SmilePlus className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <p className="text-white text-sm">Track your mood</p>
                      <p className="text-white/40 text-xs">How are you feeling?</p>
                    </div>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/40">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Enhanced Weekly Progress */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-white/60 text-xs font-light tracking-widest uppercase mb-6">
                This Week
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map(day => {
                  const date = addDays(startOfWeek(new Date()), day);
                  const hasFast = recentFasts.some(fast => 
                    isSameDay(new Date(fast.start_time), date)
                  );
                  const isCurrentDay = isToday(date);
                  const hasActiveFast = activeFast && isSameDay(new Date(activeFast.start_time), date);
                  
                  return (
                    <div key={day} className="flex flex-col items-center gap-3">
                      <div className="text-[10px] text-white/40">
                        {format(date, 'EEE')[0]}
                      </div>
                      <div 
                        className={`w-10 h-10 rounded-full border transition-all duration-500 flex items-center justify-center
                          ${isCurrentDay ? 'border-white/40 bg-white/10' : 'border-white/10'}
                          ${hasFast || hasActiveFast ? 'bg-gradient-to-br from-purple-500/30 to-blue-500/30' : ''}
                        `}
                      >
                        {(hasFast || hasActiveFast) && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
                          </svg>
                        )}
                        {isCurrentDay && !hasFast && !hasActiveFast && (
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Past Fasts Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white/60 text-xs font-light tracking-widest uppercase">
                  Recent Fasts
                </h2>
                <button
                  onClick={() => navigate(createPageUrl("History"))}
                  className="text-white/40 text-xs hover:text-white/60 transition-colors"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {recentFasts.slice(0, 3).map((fast) => {
                  const duration = differenceInHours(
                    new Date(fast.end_time || new Date()),
                    new Date(fast.start_time)
                  );
                  const completionRate = fast.end_time 
                    ? Math.round((duration / fast.duration_hours) * 100)
                    : 0;
                  
                  return (
                    <div
                      key={fast.id}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-white text-sm">
                            {format(new Date(fast.start_time), 'EEEE, MMM d')}
                          </div>
                          <div className="text-white/40 text-xs mt-1">
                            {duration}h of {fast.duration_hours}h
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-white/60 text-sm">
                            {completionRate}%
                          </div>
                          <button
                            onClick={() => handleEditFast(fast)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-white/40" />
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500/50 to-blue-500/50 transition-all duration-500"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate(createPageUrl("Community"))}
                className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="8" cy="9" r="2" stroke="white" strokeWidth="1" opacity="0.8"/>
                    <circle cx="16" cy="9" r="2" stroke="white" strokeWidth="1" opacity="0.8"/>
                    <path d="M12 14c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z" stroke="white" strokeWidth="1" opacity="0.8"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-light">Community</p>
                  <p className="text-white/40 text-xs">Join the leaderboard</p>
                </div>
              </button>

              <button
                onClick={() => navigate(createPageUrl("Breathe"))}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="0.8" fill="none" opacity="0.6"/>
                    <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="0.4" fill="none" opacity="0.4"/>
                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="0.2" fill="none" opacity="0.2"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white/80 text-sm font-light">Breathe</p>
                  <p className="text-white/40 text-xs">Mindful moments</p>
                </div>
              </button>
            </div>

            {/* Meditation Quick Access */}
            <button
              onClick={() => navigate(createPageUrl("Meditation"))}
              className="w-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" stroke="white" strokeWidth="1" opacity="0.8"/>
                  <path d="M12 3v3M12 18v3M21 12h-3M6 12H3" stroke="white" strokeWidth="1" opacity="0.4"/>
                  <circle cx="12" cy="12" r="2" fill="white" opacity="0.8"/>
                </svg>
              </div>
              <div className="text-left flex-grow">
                <p className="text-white text-sm font-light">Meditation Library</p>
                <p className="text-white/40 text-xs">Find peace during your fast</p>
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full">
                <p className="text-white/80 text-xs">12 sessions</p>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Footer - Ultra Minimal */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
          <div className="flex items-center justify-around max-w-lg mx-auto px-4 pb-8 pt-4">
            {/* Today - Active */}
            <button
              className="p-3 text-white/80 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
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

      {/* Mood Journal Modal */}
      {showMoodJournal && currentUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-lg bg-black/90 backdrop-blur-md border border-white/10 rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
              boxShadow: '0 0 50px rgba(139, 92, 246, 0.1)',
            }}
          >
            <button
              onClick={() => setShowMoodJournal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <MoodJournal 
              userId={currentUser.id} 
              onClose={() => setShowMoodJournal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}