import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User, UserProfile, FastingSession } from '@/api/entities';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Save, Settings, Trophy, Clock, Droplets, Calendar, TrendingUp } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: '',
    age: '',
    height: '',
    weight: '',
    fasting_experience: 'beginner',
    health_goals: '',
    preferred_fast_duration: '16'
  });
  const [stats, setStats] = useState({
    totalFasts: 0,
    totalHours: 0,
    longestFast: 0,
    currentStreak: 0,
    averageFast: 0,
    totalWater: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    calculateStats();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      const profiles = await UserProfile.list();
      const userProfile = profiles.find(p => p.user_id === user.id);
      
      if (userProfile) {
        setProfile({
          ...profile,
          ...userProfile,
          full_name: user.full_name || user.email
        });
      } else {
        setProfile({
          ...profile,
          full_name: user.full_name || user.email
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async () => {
    try {
      const sessions = await FastingSession.list('-created_date', 100);
      const waterLogs = JSON.parse(localStorage.getItem('waterLogs') || '[]');
      
      // Calculate statistics
      const totalFasts = sessions.length;
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
      
      const averageFast = completedFasts.length > 0 
        ? totalHours / completedFasts.length 
        : 0;
      
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
      
      // Calculate total water
      const totalWater = waterLogs.reduce((sum, log) => sum + (log.cups || 0), 0);
      
      setStats({
        totalFasts,
        totalHours: Math.round(totalHours),
        longestFast: Math.round(longestFast),
        currentStreak,
        averageFast: Math.round(averageFast),
        totalWater
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      const user = await User.me();
      const profiles = await UserProfile.list();
      const existingProfile = profiles.find(p => p.user_id === user.id);
      
      const profileData = {
        ...profile,
        user_id: user.id
      };
      
      if (existingProfile) {
        await UserProfile.update(existingProfile.id, profileData);
      } else {
        await UserProfile.create(profileData);
      }
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div 
      className="relative backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        boxShadow: `0 0 30px ${color}20, inset 0 0 20px ${color}10`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm font-light">{label}</p>
          <p className="text-3xl font-extralight text-white mt-1">{value}</p>
        </div>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color}30, ${color}20)`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const FormField = ({ label, value, onChange, type = "text", options = null, disabled = false }) => (
    <div className="space-y-2">
      <label className="text-white/60 text-sm font-light">{label}</label>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing || disabled}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-light focus:outline-none focus:border-white/30 transition-all disabled:opacity-50"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-black">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing || disabled}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-light focus:outline-none focus:border-white/30 transition-all disabled:opacity-50"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full overflow-y-auto pb-32">
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Logo size="md" className="opacity-50" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extralight text-white mb-2">Your Profile</h1>
                <p className="text-white/40 text-sm">Track your journey to optimal health</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(createPageUrl("Settings"))}
                  className="w-12 h-12 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:bg-white/10"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                  }}
                >
                  <Settings className="w-5 h-5 text-white/70" />
                </button>
                
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="px-6 py-3 rounded-full font-light text-sm transition-all duration-300 flex items-center gap-2"
                  style={{
                    background: isEditing 
                      ? 'linear-gradient(135deg, #4ade80, #22c55e)' 
                      : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: isEditing ? '#000' : '#fff',
                  }}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard 
                icon={Trophy} 
                label="Total Fasts" 
                value={stats.totalFasts}
                color="#fbbf24"
              />
              <StatCard 
                icon={Clock} 
                label="Total Hours" 
                value={`${stats.totalHours}h`}
                color="#8b5cf6"
              />
              <StatCard 
                icon={TrendingUp} 
                label="Longest Fast" 
                value={`${stats.longestFast}h`}
                color="#3b82f6"
              />
              <StatCard 
                icon={Calendar} 
                label="Current Streak" 
                value={`${stats.currentStreak} days`}
                color="#10b981"
              />
              <StatCard 
                icon={Clock} 
                label="Average Fast" 
                value={`${stats.averageFast}h`}
                color="#f59e0b"
              />
              <StatCard 
                icon={Droplets} 
                label="Water Tracked" 
                value={`${stats.totalWater} cups`}
                color="#06b6d4"
              />
            </div>

            {/* Profile Form */}
            <div 
              className="backdrop-blur-md border border-white/10 rounded-3xl p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                animation: 'fadeInUp 0.8s ease-out',
              }}
            >
              <h2 className="text-xl font-light text-white mb-6">Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField 
                  label="Full Name" 
                  value={profile.full_name}
                  onChange={(v) => setProfile({...profile, full_name: v})}
                  disabled={true}
                />
                
                <FormField 
                  label="Age" 
                  value={profile.age}
                  onChange={(v) => setProfile({...profile, age: v})}
                  type="number"
                />
                
                <FormField 
                  label="Height (cm)" 
                  value={profile.height}
                  onChange={(v) => setProfile({...profile, height: v})}
                  type="number"
                />
                
                <FormField 
                  label="Weight (kg)" 
                  value={profile.weight}
                  onChange={(v) => setProfile({...profile, weight: v})}
                  type="number"
                />
                
                <FormField 
                  label="Fasting Experience" 
                  value={profile.fasting_experience}
                  onChange={(v) => setProfile({...profile, fasting_experience: v})}
                  options={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                    { value: 'expert', label: 'Expert' }
                  ]}
                />
                
                <FormField 
                  label="Preferred Fast Duration" 
                  value={profile.preferred_fast_duration}
                  onChange={(v) => setProfile({...profile, preferred_fast_duration: v})}
                  options={[
                    { value: '16', label: '16:8' },
                    { value: '18', label: '18:6' },
                    { value: '20', label: '20:4' },
                    { value: '24', label: '24 hours' },
                    { value: '36', label: '36 hours' },
                    { value: '48', label: '48 hours' },
                    { value: '72', label: '72+ hours' }
                  ]}
                />
                
                <div className="md:col-span-2">
                  <FormField 
                    label="Health Goals" 
                    value={profile.health_goals}
                    onChange={(v) => setProfile({...profile, health_goals: v})}
                  />
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="mt-8 text-center">
              <button
                onClick={async () => {
                  try {
                    await User.signOut();
                    navigate(createPageUrl('Login'));
                  } catch (error) {
                    console.error('Error signing out:', error);
                    toast.error('Failed to sign out');
                  }
                }}
                className="px-8 py-3 rounded-full font-light text-sm transition-all duration-300 border border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Sign Out
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

            {/* Profile - Active */}
            <button
              className="p-3 text-white/80 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1"/>
                <path d="M16 20H8c-2 0-4-1-4-3s2-3 4-3h8c2 0 4 1 4 3s-2 3-4 3z" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}