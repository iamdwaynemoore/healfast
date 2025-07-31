import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Target, Flame, Clock, TrendingUp, Zap, Star, Heart } from 'lucide-react';
import { FastingSession, WaterLog } from '@/api/entities';
import { differenceInDays, format } from 'date-fns';
import { toast } from 'sonner';

const ACHIEVEMENTS = [
  // Beginner Achievements
  {
    id: 'first_fast',
    name: 'First Step',
    description: 'Complete your first fast',
    icon: <Star className="w-6 h-6" />,
    category: 'beginner',
    requirement: { type: 'total_fasts', value: 1 },
    points: 10,
    color: '#10b981'
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Fast for 7 consecutive days',
    icon: <Flame className="w-6 h-6" />,
    category: 'beginner',
    requirement: { type: 'streak', value: 7 },
    points: 25,
    color: '#f59e0b'
  },
  {
    id: 'hydration_hero',
    name: 'Hydration Hero',
    description: 'Track 64oz of water in a day',
    icon: <Heart className="w-6 h-6" />,
    category: 'beginner',
    requirement: { type: 'water_daily', value: 8 },
    points: 15,
    color: '#06b6d4'
  },

  // Intermediate Achievements
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Complete 100 hours of fasting',
    icon: <Clock className="w-6 h-6" />,
    category: 'intermediate',
    requirement: { type: 'total_hours', value: 100 },
    points: 50,
    color: '#8b5cf6'
  },
  {
    id: 'extended_master',
    name: 'Extended Master',
    description: 'Complete a 24-hour fast',
    icon: <Target className="w-6 h-6" />,
    category: 'intermediate',
    requirement: { type: 'longest_fast', value: 24 },
    points: 40,
    color: '#3b82f6'
  },
  {
    id: 'month_milestone',
    name: 'Month Milestone',
    description: 'Maintain a 30-day streak',
    icon: <Medal className="w-6 h-6" />,
    category: 'intermediate',
    requirement: { type: 'streak', value: 30 },
    points: 75,
    color: '#ec4899'
  },

  // Advanced Achievements
  {
    id: 'autophagy_expert',
    name: 'Autophagy Expert',
    description: 'Complete a 48-hour fast',
    icon: <Zap className="w-6 h-6" />,
    category: 'advanced',
    requirement: { type: 'longest_fast', value: 48 },
    points: 100,
    color: '#f43f5e'
  },
  {
    id: 'thousand_hours',
    name: 'Thousand Hour Journey',
    description: 'Accumulate 1000 hours of fasting',
    icon: <Trophy className="w-6 h-6" />,
    category: 'advanced',
    requirement: { type: 'total_hours', value: 1000 },
    points: 200,
    color: '#fbbf24'
  },
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Complete 100 fasts',
    icon: <Award className="w-6 h-6" />,
    category: 'advanced',
    requirement: { type: 'total_fasts', value: 100 },
    points: 150,
    color: '#a855f7'
  },
  {
    id: 'trending_up',
    name: 'Always Improving',
    description: 'Increase average fast duration for 4 weeks',
    icon: <TrendingUp className="w-6 h-6" />,
    category: 'advanced',
    requirement: { type: 'improvement', value: 4 },
    points: 80,
    color: '#22c55e'
  }
];

export default function AchievementSystem({ userId }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [newUnlocks, setNewUnlocks] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadAchievements();
  }, [userId]);

  const loadAchievements = async () => {
    try {
      // Load user's unlocked achievements from localStorage
      const saved = localStorage.getItem(`achievements-${userId}`);
      const unlocked = saved ? JSON.parse(saved) : [];
      setUnlockedAchievements(unlocked);
      
      // Calculate total points
      const points = unlocked.reduce((sum, achievementId) => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        return sum + (achievement?.points || 0);
      }, 0);
      setTotalPoints(points);
      
      // Calculate current stats
      await calculateUserStats();
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const calculateUserStats = async () => {
    try {
      const sessions = await FastingSession.list('-created_date', 1000);
      const waterLogs = JSON.parse(localStorage.getItem('waterLogs') || '[]');
      
      // Calculate total fasts
      const totalFasts = sessions.length;
      
      // Calculate total hours
      const totalHours = sessions.reduce((sum, s) => {
        if (s.end_time) {
          const hours = (new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60 * 60);
          return sum + hours;
        }
        return sum;
      }, 0);
      
      // Calculate longest fast
      const completedFasts = sessions.filter(s => s.end_time);
      const longestFast = Math.max(...completedFasts.map(s => 
        (new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60 * 60)
      ), 0);
      
      // Calculate current streak
      let currentStreak = 0;
      const today = new Date();
      const sortedSessions = [...sessions].sort((a, b) => 
        new Date(b.start_time) - new Date(a.start_time)
      );
      
      for (let i = 0; i < sortedSessions.length; i++) {
        const sessionDate = new Date(sortedSessions[i].start_time);
        const daysDiff = differenceInDays(today, sessionDate);
        
        if (daysDiff === i) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      // Calculate max water in a day
      const waterByDay = {};
      waterLogs.forEach(log => {
        const day = format(new Date(log.created_date), 'yyyy-MM-dd');
        waterByDay[day] = (waterByDay[day] || 0) + (log.cups || 0);
      });
      const maxWaterDaily = Math.max(...Object.values(waterByDay), 0);
      
      const stats = {
        total_fasts: totalFasts,
        total_hours: Math.round(totalHours),
        longest_fast: Math.round(longestFast),
        streak: currentStreak,
        water_daily: maxWaterDaily,
        improvement: 0 // This would need more complex calculation
      };
      
      setUserStats(stats);
      
      // Check for new achievements
      checkAchievements(stats);
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const checkAchievements = (stats) => {
    const newlyUnlocked = [];
    
    ACHIEVEMENTS.forEach(achievement => {
      // Skip if already unlocked
      if (unlockedAchievements.includes(achievement.id)) return;
      
      // Check if requirement is met
      const req = achievement.requirement;
      const userValue = stats[req.type] || 0;
      
      if (userValue >= req.value) {
        newlyUnlocked.push(achievement);
      }
    });
    
    if (newlyUnlocked.length > 0) {
      // Save new unlocks
      const allUnlocked = [...unlockedAchievements, ...newlyUnlocked.map(a => a.id)];
      localStorage.setItem(`achievements-${userId}`, JSON.stringify(allUnlocked));
      setUnlockedAchievements(allUnlocked);
      setNewUnlocks(newlyUnlocked);
      
      // Show notifications
      newlyUnlocked.forEach(achievement => {
        toast.success(
          <div className="flex items-center gap-3">
            <div style={{ color: achievement.color }}>{achievement.icon}</div>
            <div>
              <p className="font-medium">{achievement.name} Unlocked!</p>
              <p className="text-sm text-gray-600">+{achievement.points} points</p>
            </div>
          </div>
        );
      });
      
      // Update total points
      const points = allUnlocked.reduce((sum, achievementId) => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        return sum + (achievement?.points || 0);
      }, 0);
      setTotalPoints(points);
    }
  };

  const getProgress = (achievement) => {
    const req = achievement.requirement;
    const userValue = userStats[req.type] || 0;
    return Math.min((userValue / req.value) * 100, 100);
  };

  const AchievementCard = ({ achievement, unlocked, progress }) => {
    const isNew = newUnlocks.some(a => a.id === achievement.id);
    
    return (
      <div
        className={`relative backdrop-blur-md border rounded-2xl p-4 transition-all duration-500 ${
          unlocked 
            ? 'border-white/20 bg-white/10 scale-100' 
            : 'border-white/10 bg-white/5 opacity-60 scale-95'
        } ${isNew ? 'animate-pulse' : ''}`}
        style={{
          boxShadow: unlocked ? `0 0 30px ${achievement.color}20` : 'none',
        }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: unlocked 
                ? `linear-gradient(135deg, ${achievement.color}40, ${achievement.color}20)`
                : 'rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ color: unlocked ? achievement.color : 'rgba(255,255,255,0.4)' }}>
              {achievement.icon}
            </div>
          </div>
          
          <div className="flex-grow">
            <h4 className="text-white font-light text-sm mb-1">{achievement.name}</h4>
            <p className="text-white/60 text-xs leading-relaxed mb-2">{achievement.description}</p>
            
            {!unlocked && (
              <div className="space-y-1">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${achievement.color}60, ${achievement.color}40)`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-white/40">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}
          </div>
          
          {unlocked && (
            <div className="text-right">
              <p className="text-xs text-white/40">Points</p>
              <p className="text-lg font-light text-white">{achievement.points}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Achievement Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-yellow-500/20 backdrop-blur-sm border border-white/10">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-light">
            {totalPoints} Points • {unlockedAchievements.length}/{ACHIEVEMENTS.length} Achievements
          </span>
        </div>
      </div>

      {/* Achievement Categories */}
      {['beginner', 'intermediate', 'advanced'].map(category => {
        const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category);
        const unlockedInCategory = categoryAchievements.filter(a => 
          unlockedAchievements.includes(a.id)
        ).length;
        
        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white/80 text-sm font-light capitalize">
                {category} Achievements
              </h3>
              <span className="text-white/40 text-xs">
                {unlockedInCategory}/{categoryAchievements.length} unlocked
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              {categoryAchievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlockedAchievements.includes(achievement.id)}
                  progress={getProgress(achievement)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}