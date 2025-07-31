import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User, UserProfile, FastingSession } from '@/api/entities';
import { format, formatDistanceToNow } from 'date-fns';
import Logo from '@/components/Logo';

export default function Community() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeFilter, setActiveFilter] = useState('streak');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCommunityData();
  }, [activeFilter]);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await User.me();
      setCurrentUser(user);
      
      // For demo purposes, create mock community data
      const mockUsers = await generateMockCommunityData();
      
      // Sort based on active filter
      let sortedUsers = [...mockUsers];
      switch (activeFilter) {
        case 'streak':
          sortedUsers.sort((a, b) => b.currentStreak - a.currentStreak);
          break;
        case 'hours':
          sortedUsers.sort((a, b) => b.totalHours - a.totalHours);
          break;
        case 'longest':
          sortedUsers.sort((a, b) => b.longestFast - a.longestFast);
          break;
      }
      
      setLeaderboard(sortedUsers);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockCommunityData = async () => {
    // Get real user data
    const sessions = await FastingSession.list('-created_date', 100);
    const profiles = await UserProfile.list();
    const user = await User.me();
    const userProfile = profiles.find(p => p.user_id === user.id);
    
    // Calculate real user stats
    const userStats = calculateUserStats(sessions);
    
    // Create mock users for demonstration
    const mockNames = [
      'Sarah C.', 'Marcus J.', 'Elena R.', 'David K.', 
      'Jessica W.', 'Ahmed H.', 'Maria G.', 'James W.',
      'Priya P.', 'Michael B.', 'Lisa A.', 'Carlos M.'
    ];
    
    const mockUsers = mockNames.map((name, index) => ({
      id: `mock-${index}`,
      name,
      fastingStyle: ['16:8', '18:6', '20:4', 'OMAD', 'ADF'][Math.floor(Math.random() * 5)],
      currentStreak: Math.floor(Math.random() * 30) + 1,
      totalHours: Math.floor(Math.random() * 500) + 100,
      longestFast: Math.floor(Math.random() * 72) + 16,
      isCurrentUser: false
    }));
    
    // Add real user to the list
    mockUsers.push({
      id: user.id,
      name: user.full_name?.split(' ')[0] || 'You',
      fastingStyle: userProfile?.preferred_fast_duration ? 
        (userProfile.preferred_fast_duration === '16' ? '16:8' : 
         userProfile.preferred_fast_duration === '18' ? '18:6' : 
         userProfile.preferred_fast_duration === '20' ? '20:4' : 
         userProfile.preferred_fast_duration === '24' ? 'OMAD' : 'Extended') 
        : '16:8',
      currentStreak: userStats.currentStreak,
      totalHours: userStats.totalHours,
      longestFast: userStats.longestFast,
      isCurrentUser: true
    });
    
    return mockUsers;
  };

  const calculateUserStats = (sessions) => {
    const totalHours = sessions.reduce((sum, s) => {
      if (s.end_time) {
        const duration = (new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60 * 60);
        return sum + duration;
      }
      return sum;
    }, 0);
    
    const completedFasts = sessions.filter(s => s.end_time);
    const longestFast = Math.max(...completedFasts.map(s => 
      (new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60 * 60)
    ), 0);
    
    // Calculate streak
    let currentStreak = 0;
    const today = new Date();
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.start_time) - new Date(a.start_time)
    );
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].start_time);
      const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return {
      totalHours: Math.round(totalHours),
      longestFast: Math.round(longestFast),
      currentStreak
    };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const getValue = (user) => {
    switch (activeFilter) {
      case 'streak':
        return `${user.currentStreak}d`;
      case 'hours':
        return `${user.totalHours}h`;
      case 'longest':
        return `${user.longestFast}h`;
      default:
        return '0';
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto p-6 md:p-8">
          {/* Header - Ultra Minimal */}
          <div className="mb-12 text-center">
            <Logo size="sm" className="mb-8 opacity-50" />
            <h1 className="text-2xl font-extralight text-white mb-2">Leaderboard</h1>
            <p className="text-white/30 text-xs font-light tracking-wider uppercase">Global Community</p>
          </div>

          {/* Filter Pills - Minimal */}
          <div className="flex justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveFilter('streak')}
              className={`px-4 py-2 text-xs font-light rounded-full transition-all ${
                activeFilter === 'streak' 
                  ? 'bg-white text-black' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Streak
            </button>
            <button
              onClick={() => setActiveFilter('hours')}
              className={`px-4 py-2 text-xs font-light rounded-full transition-all ${
                activeFilter === 'hours' 
                  ? 'bg-white text-black' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Total
            </button>
            <button
              onClick={() => setActiveFilter('longest')}
              className={`px-4 py-2 text-xs font-light rounded-full transition-all ${
                activeFilter === 'longest' 
                  ? 'bg-white text-black' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Longest
            </button>
          </div>

          {/* Leaderboard - Clean List */}
          <div className="space-y-1">
            {leaderboard.slice(0, 15).map((user, index) => {
              const position = index + 1;
              const isTop3 = position <= 3;
              
              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between py-3 px-4 rounded-lg transition-all hover:bg-white/5 ${
                    user.isCurrentUser ? 'bg-white/5' : ''
                  }`}
                  style={{
                    animation: `slideInFade 0.6s ease-out ${index * 0.05}s forwards`,
                    opacity: 0,
                    transform: 'translateX(-20px)'
                  }}
                >
                  {/* Rank & Name */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className={`w-6 text-center ${
                      isTop3 ? 'text-white' : 'text-white/30'
                    }`}
                      style={isTop3 ? {
                        animation: `rankGlow 3s ease-in-out infinite`,
                        animationDelay: `${index * 0.2}s`
                      } : {}}
                    >
                      <span className={`${isTop3 ? 'text-sm font-normal' : 'text-xs font-light'}`}>
                        {position}
                      </span>
                    </div>
                    <div className="min-w-[100px]">
                      <p className={`${
                        user.isCurrentUser 
                          ? 'text-white font-normal' 
                          : isTop3 
                          ? 'text-white/90 font-light' 
                          : 'text-white/60 font-light'
                      } text-sm`}>
                        {user.name}
                      </p>
                      <p className="text-white/30 text-[10px] font-light mt-0.5">
                        {user.fastingStyle}
                      </p>
                    </div>
                  </div>

                  {/* Animated Bar */}
                  <div className="flex-grow mx-4 relative h-[1px] overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                      style={{
                        width: '100%',
                        animation: `flowBar ${3 + index * 0.2}s ease-in-out infinite`,
                        animationDelay: `${index * 0.1}s`,
                        opacity: isTop3 ? 0.8 : 0.4
                      }}
                    />
                    <div 
                      className="absolute h-full bg-blue-500/20"
                      style={{
                        width: `${(user[activeFilter] / Math.max(...leaderboard.map(u => u[activeFilter]))) * 100}%`,
                        animation: `pulseWidth ${4 + index * 0.3}s ease-in-out infinite`,
                        animationDelay: `${index * 0.15}s`
                      }}
                    />
                  </div>

                  {/* Value */}
                  <div className={`${
                    isTop3 ? 'text-white' : 'text-white/40'
                  } text-sm font-light tabular-nums flex-shrink-0`}
                  >
                    {getValue(user)}
                  </div>
                </div>
              );
            })}
          </div>

          <style jsx>{`
            @keyframes slideInFade {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes pulseValue {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.8;
                transform: scale(0.98);
              }
            }
            
            @keyframes rankGlow {
              0%, 100% {
                opacity: 1;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
              }
              50% {
                opacity: 0.9;
                text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
              }
            }
            
            @keyframes flowBar {
              0% {
                transform: translateX(-100%);
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              100% {
                transform: translateX(100%);
                opacity: 0;
              }
            }
            
            @keyframes pulseWidth {
              0%, 100% {
                width: calc(var(--width) * 0.8);
                opacity: 0.3;
              }
              50% {
                width: var(--width);
                opacity: 0.6;
              }
            }
          `}</style>

          {/* View More */}
          <div className="mt-8 text-center">
            <button className="text-white/30 text-xs hover:text-white/50 transition-colors">
              View Full Leaderboard
            </button>
          </div>
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

          {/* Community - Active */}
          <button
            className="p-3 text-white/80 relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
              <circle cx="8" cy="9" r="2" stroke="currentColor" strokeWidth="1"/>
              <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1"/>
              <path d="M12 14c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z" stroke="currentColor" strokeWidth="1"/>
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
  );
}