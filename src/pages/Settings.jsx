import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Bell, Moon, Sun, Shield, Info, LogOut, Palette, Globe, Clock } from 'lucide-react';
import { User, UserProfile } from '@/api/entities';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      fastReminders: true,
      achievements: true,
      communityUpdates: false,
      moodReminders: true
    },
    theme: 'dark', // dark, midnight, aurora
    units: {
      weight: 'lbs', // lbs or kg
      height: 'ft', // ft or cm
      time: '12h' // 12h or 24h
    },
    privacy: {
      showInLeaderboard: true,
      shareProgress: true
    },
    fasting: {
      defaultDuration: 16,
      preferredStartTime: 20,
      autoTrackWater: true
    }
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const profiles = await UserProfile.list();
      const userProfile = profiles.find(p => p.user_id === user.id);
      setProfile(userProfile);
      
      // Load settings from localStorage
      const savedSettings = localStorage.getItem(`settings-${user.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    setSettings(newSettings);
    
    // Save to localStorage
    if (currentUser) {
      localStorage.setItem(`settings-${currentUser.id}`, JSON.stringify(newSettings));
    }
    
    toast.success('Settings updated');
  };

  const updateTheme = (theme) => {
    setSettings({ ...settings, theme });
    if (currentUser) {
      localStorage.setItem(`settings-${currentUser.id}`, JSON.stringify({ ...settings, theme }));
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    toast.success(`Theme changed to ${theme}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const themes = [
    { id: 'dark', name: 'Dark', gradient: 'from-gray-900 to-black', icon: <Moon className="w-4 h-4" /> },
    { id: 'midnight', name: 'Midnight', gradient: 'from-blue-900 to-black', icon: <Moon className="w-4 h-4" /> },
    { id: 'aurora', name: 'Aurora', gradient: 'from-purple-900 via-blue-900 to-black', icon: <Sun className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto p-6 md:p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="sm" className="opacity-50" />
          </div>
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(createPageUrl("Profile"))}
              className="w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 text-white/70" />
            </button>
            <h1 className="text-3xl font-extralight text-white">Settings</h1>
          </div>

          {/* Theme Selection */}
          <div className="backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-white/60" />
              <h2 className="text-white text-lg font-light">Theme</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => updateTheme(theme.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    settings.theme === theme.id
                      ? 'border-white/30 bg-white/10'
                      : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${theme.gradient} mb-3`} />
                  <div className="flex items-center justify-center gap-2">
                    {theme.icon}
                    <span className="text-white/80 text-sm">{theme.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-white/60" />
              <h2 className="text-white text-lg font-light">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Fast Reminders</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.fastReminders}
                  onChange={(e) => updateSetting('notifications', 'fastReminders', e.target.checked)}
                  className="toggle"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Achievement Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.achievements}
                  onChange={(e) => updateSetting('notifications', 'achievements', e.target.checked)}
                  className="toggle"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Community Updates</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.communityUpdates}
                  onChange={(e) => updateSetting('notifications', 'communityUpdates', e.target.checked)}
                  className="toggle"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Mood Check-ins</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.moodReminders}
                  onChange={(e) => updateSetting('notifications', 'moodReminders', e.target.checked)}
                  className="toggle"
                />
              </label>
            </div>
          </div>

          {/* Units & Format */}
          <div className="backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-white/60" />
              <h2 className="text-white text-lg font-light">Units & Format</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-xs mb-2 block">Weight</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSetting('units', 'weight', 'lbs')}
                    className={`p-2 rounded-lg border transition-all ${
                      settings.units.weight === 'lbs'
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-white/80 text-sm">Pounds (lbs)</span>
                  </button>
                  <button
                    onClick={() => updateSetting('units', 'weight', 'kg')}
                    className={`p-2 rounded-lg border transition-all ${
                      settings.units.weight === 'kg'
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-white/80 text-sm">Kilograms (kg)</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs mb-2 block">Time Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSetting('units', 'time', '12h')}
                    className={`p-2 rounded-lg border transition-all ${
                      settings.units.time === '12h'
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-white/80 text-sm">12-hour</span>
                  </button>
                  <button
                    onClick={() => updateSetting('units', 'time', '24h')}
                    className={`p-2 rounded-lg border transition-all ${
                      settings.units.time === '24h'
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-white/80 text-sm">24-hour</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-white/60" />
              <h2 className="text-white text-lg font-light">Privacy</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Show in Leaderboard</span>
                <input
                  type="checkbox"
                  checked={settings.privacy.showInLeaderboard}
                  onChange={(e) => updateSetting('privacy', 'showInLeaderboard', e.target.checked)}
                  className="toggle"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Share Progress</span>
                <input
                  type="checkbox"
                  checked={settings.privacy.shareProgress}
                  onChange={(e) => updateSetting('privacy', 'shareProgress', e.target.checked)}
                  className="toggle"
                />
              </label>
            </div>
          </div>

          {/* Fasting Defaults */}
          <div className="backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-white/60" />
              <h2 className="text-white text-lg font-light">Fasting Defaults</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-xs mb-2 block">Default Duration</label>
                <select
                  value={settings.fasting.defaultDuration}
                  onChange={(e) => updateSetting('fasting', 'defaultDuration', parseInt(e.target.value))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                >
                  <option value="12">12 hours</option>
                  <option value="14">14 hours</option>
                  <option value="16">16 hours</option>
                  <option value="18">18 hours</option>
                  <option value="20">20 hours</option>
                  <option value="24">24 hours</option>
                </select>
              </div>
              <label className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Auto-track Water</span>
                <input
                  type="checkbox"
                  checked={settings.fasting.autoTrackWater}
                  onChange={(e) => updateSetting('fasting', 'autoTrackWater', e.target.checked)}
                  className="toggle"
                />
              </label>
            </div>
          </div>

          {/* About */}
          <div className="backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-white/60" />
              <h2 className="text-white text-lg font-light">About</h2>
            </div>
            <div className="space-y-2 text-white/60 text-sm">
              <p>HealFast v1.0.0</p>
              <p>© 2024 HealFast. All rights reserved.</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-light hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
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
      
      {/* Custom Toggle Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .toggle {
          appearance: none;
          width: 44px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .toggle:checked {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5));
          border-color: rgba(139, 92, 246, 0.5);
        }
        
        .toggle::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: all 0.3s;
        }
        
        .toggle:checked::after {
          transform: translateX(20px);
        }
      `}} />
    </div>
  );
}