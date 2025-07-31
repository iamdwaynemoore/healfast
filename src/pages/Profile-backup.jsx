import React, { useState, useEffect } from "react";
import { UserProfile, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  User as UserIcon, 
  Settings, 
  Target,
  Activity,
  Save
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [currentUser, userProfiles] = await Promise.all([
        User.me(),
        UserProfile.list()
      ]);
      
      setUser(currentUser);
      setProfile(userProfiles[0] || {});
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (profile.id) {
        await UserProfile.update(profile.id, profile);
      } else {
        await UserProfile.create(profile);
      }
      setIsEditing(false);
      loadProfileData();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 pb-32" style={{
        background: 'linear-gradient(180deg, #000000 0%, #0A0E15 60%, #1A2B5C 85%, #2C4AA0 100%)'
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="h-12 bg-slate-800 rounded-xl animate-pulse mb-8"></div>
          <div className="h-96 bg-slate-800 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pb-32" style={{
      background: 'linear-gradient(180deg, #000000 0%, #0A0E15 60%, #1A2B5C 85%, #2C4AA0 100%)'
    }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-light gradient-text">Profile</h1>
              <p className="text-slate-400 text-sm">
                {user?.full_name || user?.email}
              </p>
            </div>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="glass-morphism border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200 font-medium">
              <UserIcon className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Height (cm)</Label>
                  <Input
                    type="number"
                    value={profile.height || ''}
                    onChange={(e) => setProfile({...profile, height: parseInt(e.target.value)})}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Weight (kg)</Label>
                  <Input
                    type="number"
                    value={profile.weight || ''}
                    onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value)})}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Age</Label>
                  <Input
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Gender</Label>
                  <Select value={profile.gender || ''} onValueChange={(value) => setProfile({...profile, gender: value})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400">Height</p>
                    <p className="text-slate-200">{profile.height ? `${profile.height} cm` : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Age</p>
                    <p className="text-slate-200">{profile.age || 'Not set'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400">Weight</p>
                    <p className="text-slate-200">{profile.weight ? `${profile.weight} kg` : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Gender</p>
                    <p className="text-slate-200 capitalize">{profile.gender || 'Not set'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fasting Goals */}
        <Card className="glass-morphism border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-200 font-medium">
              <Target className="w-5 h-5 text-primary" />
              Fasting Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Primary Goal</Label>
                  <Select value={profile.primary_goal || ''} onValueChange={(value) => setProfile({...profile, primary_goal: value})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="health_improvement">Health Improvement</SelectItem>
                      <SelectItem value="spiritual">Spiritual</SelectItem>
                      <SelectItem value="longevity">Longevity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Experience Level</Label>
                  <Select value={profile.fasting_experience || ''} onValueChange={(value) => setProfile({...profile, fasting_experience: value})}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400">Primary Goal</p>
                  <p className="text-slate-200 capitalize">{profile.primary_goal?.replace('_', ' ') || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Experience Level</p>
                  <p className="text-slate-200 capitalize">{profile.fasting_experience || 'Not set'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[100px] w-full pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundColor: '#0A0E15',
            clipPath: 'ellipse(130% 100% at 50% 100%)',
          }}
        />
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 h-[90px] flex justify-center items-center"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        <div className="flex items-center justify-around w-full max-w-lg px-4">
          
          {/* Today */}
          <button 
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-white/10 opacity-70 hover:opacity-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#F8FAFB"/>
              <circle cx="12" cy="12" r="8" stroke="#F8FAFB" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>

          {/* Breathe */}
          <button 
            onClick={() => navigate(createPageUrl("Breathe"))}
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-white/10 opacity-70 hover:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3c-2 2-2 4 0 6 2-2 2-4 0-6z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M20.5 7.5c-2.8 0.8-4.2 2.8-3.5 5.5 2.8-0.8 4.2-2.8 3.5-5.5z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M20.5 16.5c-0.8-2.8-2.8-4.2-5.5-3.5 0.8 2.8 2.8 4.2 5.5 3.5z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M12 21c2-2 2-4 0-6-2 2-2 4 0 6z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M3.5 16.5c2.8-0.8 4.2-2.8 3.5-5.5-2.8 0.8-4.2 2.8-3.5 5.5z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M3.5 7.5c0.8 2.8 2.8 4.2 5.5 3.5-0.8-2.8-2.8-4.2-5.5-3.5z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <circle cx="12" cy="12" r="2" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
            </svg>
          </button>

          {/* Timer - Center */}
          <button 
            onClick={() => navigate(createPageUrl("ActiveTimer"))}
            className="flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 relative hover:bg-white/10 opacity-70 hover:opacity-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#F8FAFB" strokeWidth="1.5"/>
              <polyline points="12,6 12,12 16,14" stroke="#F8FAFB" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Nutrition */}
          <button 
            onClick={() => navigate(createPageUrl("Nutrition"))}
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-white/10 opacity-70 hover:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 2v7c0 6 4 10 9 10s9-4 9-10V2h-4" stroke="#F8FAFB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 2v20" stroke="#F8FAFB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Profile - Active */}
          <button 
            onClick={() => navigate(createPageUrl("Profile"))}
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 relative"
            style={{
              background: 'linear-gradient(135deg, #7FB3D3, #4A90A4)',
              filter: 'drop-shadow(0 0 8px rgba(127, 179, 211, 0.4))'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="1.2"/>
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
}