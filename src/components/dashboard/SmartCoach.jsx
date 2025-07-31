import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, Target, Sparkles, Sun, Moon } from 'lucide-react';
import { FastingSession, UserProfile } from '@/api/entities';
import { format, addHours, differenceInHours } from 'date-fns';

export default function SmartCoach({ currentUser }) {
  const [recommendation, setRecommendation] = useState(null);
  const [insights, setInsights] = useState([]);
  const [circadianData, setCircadianData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeUserPatterns();
  }, [currentUser]);

  const analyzeUserPatterns = async () => {
    try {
      const sessions = await FastingSession.list('-created_date', 30);
      const profiles = await UserProfile.list();
      const userProfile = profiles.find(p => p.user_id === currentUser?.id);
      
      // Analyze fasting patterns
      const analysis = {
        averageDuration: calculateAverageDuration(sessions),
        successRate: calculateSuccessRate(sessions),
        preferredStartTime: findPreferredStartTime(sessions),
        longestStreak: calculateLongestStreak(sessions),
        recentTrend: analyzeTrend(sessions),
        healthGoals: userProfile?.health_goals || 'weight loss'
      };

      // Generate personalized recommendation
      const rec = generateRecommendation(analysis, userProfile);
      setRecommendation(rec);

      // Generate insights
      const userInsights = generateInsights(analysis, sessions);
      setInsights(userInsights);

      // Calculate circadian rhythm data
      const circadian = calculateCircadianRhythm();
      setCircadianData(circadian);

      setLoading(false);
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      setLoading(false);
    }
  };

  const calculateAverageDuration = (sessions) => {
    const completedSessions = sessions.filter(s => s.end_time);
    if (completedSessions.length === 0) return 16;
    
    const totalHours = completedSessions.reduce((sum, s) => {
      const hours = differenceInHours(new Date(s.end_time), new Date(s.start_time));
      return sum + hours;
    }, 0);
    
    return Math.round(totalHours / completedSessions.length);
  };

  const calculateSuccessRate = (sessions) => {
    if (sessions.length === 0) return 100;
    const completed = sessions.filter(s => s.end_time && s.completed).length;
    return Math.round((completed / sessions.length) * 100);
  };

  const findPreferredStartTime = (sessions) => {
    if (sessions.length === 0) return 20; // Default 8 PM
    
    const startHours = sessions.map(s => new Date(s.start_time).getHours());
    const hourCounts = {};
    
    startHours.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const preferredHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return preferredHour ? parseInt(preferredHour[0]) : 20;
  };

  const calculateLongestStreak = (sessions) => {
    // Implementation for streak calculation
    return sessions.length; // Simplified for now
  };

  const analyzeTrend = (sessions) => {
    if (sessions.length < 2) return 'stable';
    
    const recentSessions = sessions.slice(0, 5);
    const olderSessions = sessions.slice(5, 10);
    
    const recentAvg = calculateAverageDuration(recentSessions);
    const olderAvg = calculateAverageDuration(olderSessions);
    
    if (recentAvg > olderAvg * 1.1) return 'improving';
    if (recentAvg < olderAvg * 0.9) return 'declining';
    return 'stable';
  };

  const generateRecommendation = (analysis, profile) => {
    const { averageDuration, successRate, preferredStartTime, recentTrend } = analysis;
    
    let title, description, suggestion, targetHours;

    // AI-like recommendation logic
    if (successRate < 70) {
      targetHours = Math.max(12, averageDuration - 2);
      title = "Let's Build Consistency";
      description = "Your success rate is below optimal. I recommend shorter, more achievable fasts.";
      suggestion = `Try a ${targetHours}:${24-targetHours} protocol starting at ${formatHour(preferredStartTime)}`;
    } else if (recentTrend === 'improving' && successRate > 85) {
      targetHours = Math.min(24, averageDuration + 2);
      title = "Ready to Level Up!";
      description = "You're crushing it! Your body is adapting well to fasting.";
      suggestion = `Extend to ${targetHours} hours for enhanced autophagy benefits`;
    } else if (recentTrend === 'declining') {
      title = "Time to Recalibrate";
      description = "I've noticed some challenges lately. Let's adjust your approach.";
      suggestion = "Take a 2-day break, then restart with your comfortable duration";
    } else {
      title = "Maintain Your Rhythm";
      description = "You've found your sweet spot! Consistency is key.";
      suggestion = `Continue with ${averageDuration}-hour fasts at ${formatHour(preferredStartTime)}`;
    }

    const nextFastTime = getNextOptimalFastTime(preferredStartTime);

    return {
      title,
      description,
      suggestion,
      targetHours: targetHours || averageDuration,
      nextFastTime,
      confidence: Math.min(95, 60 + sessions.length * 2) // More data = higher confidence
    };
  };

  const generateInsights = (analysis, sessions) => {
    const insights = [];
    
    if (analysis.successRate > 90) {
      insights.push({
        icon: <TrendingUp className="w-4 h-4" />,
        text: "90%+ success rate - You're in the top 10% of fasters!",
        type: 'success'
      });
    }
    
    if (analysis.averageDuration > 20) {
      insights.push({
        icon: <Target className="w-4 h-4" />,
        text: "Advanced faster - Your body efficiently uses fat for fuel",
        type: 'achievement'
      });
    }
    
    if (analysis.recentTrend === 'improving') {
      insights.push({
        icon: <Sparkles className="w-4 h-4" />,
        text: "Upward trend detected - Keep up the momentum!",
        type: 'positive'
      });
    }
    
    // Circadian rhythm insight
    if (analysis.preferredStartTime >= 18 && analysis.preferredStartTime <= 20) {
      insights.push({
        icon: <Brain className="w-4 h-4" />,
        text: "Perfect timing - Evening fasts align with circadian rhythm",
        type: 'info'
      });
    }
    
    return insights;
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour || 12;
    return `${displayHour}:00 ${period}`;
  };

  const getNextOptimalFastTime = (preferredHour) => {
    const now = new Date();
    const todayAtPreferredHour = new Date(now);
    todayAtPreferredHour.setHours(preferredHour, 0, 0, 0);
    
    if (now < todayAtPreferredHour) {
      return todayAtPreferredHour;
    } else {
      const tomorrow = new Date(todayAtPreferredHour);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }
  };

  const calculateCircadianRhythm = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Circadian phases
    const phases = {
      earlyMorning: { start: 4, end: 6, name: 'Cortisol Rise', ideal: 'light exposure' },
      morning: { start: 6, end: 10, name: 'Peak Alertness', ideal: 'complex tasks' },
      midday: { start: 10, end: 14, name: 'High Energy', ideal: 'physical activity' },
      afternoon: { start: 14, end: 17, name: 'Post-Lunch Dip', ideal: 'light tasks' },
      evening: { start: 17, end: 21, name: 'Second Wind', ideal: 'social activities' },
      night: { start: 21, end: 23, name: 'Melatonin Rise', ideal: 'wind down' },
      lateNight: { start: 23, end: 4, name: 'Deep Rest', ideal: 'sleep' }
    };
    
    // Find current phase
    let currentPhase = null;
    for (const [key, phase] of Object.entries(phases)) {
      if (phase.start <= phase.end) {
        if (hour >= phase.start && hour < phase.end) {
          currentPhase = { ...phase, key };
          break;
        }
      } else {
        // Handle overnight phases
        if (hour >= phase.start || hour < phase.end) {
          currentPhase = { ...phase, key };
          break;
        }
      }
    }
    
    // Fasting recommendations based on circadian rhythm
    const fastingOptimal = {
      start: hour >= 18 && hour <= 21,
      break: hour >= 6 && hour <= 10,
      energy: hour >= 10 && hour <= 14,
      rest: hour >= 21 || hour < 6
    };
    
    return {
      currentPhase,
      fastingOptimal,
      hormones: getHormoneStatus(hour),
      recommendation: getCircadianRecommendation(hour)
    };
  };
  
  const getHormoneStatus = (hour) => {
    const hormones = [];
    
    if (hour >= 4 && hour <= 8) {
      hormones.push({ name: 'Cortisol', level: 'High', effect: 'Natural awakening' });
    }
    if (hour >= 21 || hour <= 2) {
      hormones.push({ name: 'Melatonin', level: 'High', effect: 'Sleep promotion' });
    }
    if (hour >= 10 && hour <= 14) {
      hormones.push({ name: 'Testosterone', level: 'Peak', effect: 'Muscle growth' });
    }
    if (hour >= 23 || hour <= 3) {
      hormones.push({ name: 'Growth Hormone', level: 'Peak', effect: 'Repair & recovery' });
    }
    
    return hormones;
  };
  
  const getCircadianRecommendation = (hour) => {
    if (hour >= 6 && hour <= 10) {
      return 'Optimal time to break your fast - insulin sensitivity is highest';
    } else if (hour >= 18 && hour <= 21) {
      return 'Ideal time to start fasting - aligns with natural melatonin production';
    } else if (hour >= 14 && hour <= 16) {
      return 'Natural energy dip - stay hydrated and consider light movement';
    } else if (hour >= 21 || hour <= 6) {
      return 'Rest period - fasting enhances cellular repair during sleep';
    } else {
      return 'Stay consistent with your fasting window for best results';
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-md border border-white/10 rounded-3xl p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Coach Recommendation */}
      <div 
        className="relative backdrop-blur-md border border-white/10 rounded-3xl p-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)',
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-grow">
              <h3 className="text-white font-light text-lg mb-1">{recommendation?.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{recommendation?.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">AI Confidence</p>
              <p className="text-lg font-light text-white">{recommendation?.confidence}%</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 mb-4">
            <p className="text-white/80 text-sm mb-2">💡 Recommendation</p>
            <p className="text-white font-light">{recommendation?.suggestion}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Next Optimal Fast</p>
              <p className="text-white text-sm">
                {format(recommendation?.nextFastTime || new Date(), 'MMM d, h:mm a')}
              </p>
            </div>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-white text-sm font-light hover:from-purple-500/30 hover:to-blue-500/30 transition-all"
            >
              Schedule Fast
            </button>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm border transition-all hover:scale-[1.01] ${
                insight.type === 'success' ? 'border-green-500/20 bg-green-500/5' :
                insight.type === 'achievement' ? 'border-yellow-500/20 bg-yellow-500/5' :
                insight.type === 'positive' ? 'border-blue-500/20 bg-blue-500/5' :
                'border-white/10 bg-white/5'
              }`}
            >
              <div className={`${
                insight.type === 'success' ? 'text-green-400' :
                insight.type === 'achievement' ? 'text-yellow-400' :
                insight.type === 'positive' ? 'text-blue-400' :
                'text-white/60'
              }`}>
                {insight.icon}
              </div>
              <p className="text-white/80 text-sm font-light">{insight.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Circadian Rhythm Card */}
      {circadianData && (
        <div 
          className="relative backdrop-blur-md border border-white/10 rounded-3xl p-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(59, 130, 246, 0.1))',
            boxShadow: '0 0 40px rgba(251, 191, 36, 0.1)',
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-blue-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-blue-500/20 flex items-center justify-center">
                {circadianData.currentPhase?.key?.includes('night') || circadianData.currentPhase?.key?.includes('Night') ? (
                  <Moon className="w-6 h-6 text-white" />
                ) : (
                  <Sun className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-white font-light text-lg mb-1">Circadian Rhythm</h3>
                <p className="text-white/60 text-sm">Current Phase: {circadianData.currentPhase?.name}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 mb-4">
              <p className="text-white/80 text-sm mb-2">🌞 Biological Clock</p>
              <p className="text-white font-light text-sm">{circadianData.recommendation}</p>
            </div>

            {/* Hormone Status */}
            {circadianData.hormones.length > 0 && (
              <div className="space-y-2">
                <p className="text-white/60 text-xs mb-2">Active Hormones</p>
                <div className="grid grid-cols-2 gap-2">
                  {circadianData.hormones.map((hormone, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-2">
                      <p className="text-white text-xs font-light">{hormone.name}</p>
                      <p className="text-white/40 text-[10px]">{hormone.effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optimal Activities */}
            <div className="mt-4 flex items-center gap-2 text-white/60 text-xs">
              <span>Ideal for:</span>
              <span className="px-2 py-1 bg-white/10 rounded-full text-white/80">
                {circadianData.currentPhase?.ideal}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}