-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  fasting_experience TEXT DEFAULT 'beginner',
  health_goals TEXT,
  preferred_fast_duration INTEGER DEFAULT 16,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fasting_sessions table
CREATE TABLE public.fasting_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  protocol TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  planned_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  duration_hours INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'stopped')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  is_unlocked BOOLEAN DEFAULT false,
  UNIQUE(user_id, badge_id)
);

-- Create water_logs table
CREATE TABLE public.water_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  cups INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create mood_entries table
CREATE TABLE public.mood_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  mood_value INTEGER NOT NULL,
  energy_level TEXT NOT NULL,
  symptoms TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meditation_stats table
CREATE TABLE public.meditation_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_minutes INTEGER DEFAULT 0,
  sessions_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_session_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  notifications JSONB DEFAULT '{"fastReminders": true, "achievements": true, "communityUpdates": false, "moodReminders": true}'::jsonb,
  theme TEXT DEFAULT 'dark',
  units JSONB DEFAULT '{"weight": "lbs", "height": "ft", "time": "12h"}'::jsonb,
  privacy JSONB DEFAULT '{"showInLeaderboard": true, "shareProgress": true}'::jsonb,
  fasting JSONB DEFAULT '{"defaultDuration": 16, "preferredStartTime": 20, "autoTrackWater": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Row Level Security policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fasting sessions policies
CREATE POLICY "Users can view their own fasting sessions" ON public.fasting_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fasting sessions" ON public.fasting_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fasting sessions" ON public.fasting_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fasting sessions" ON public.fasting_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view their own achievements" ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" ON public.achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" ON public.achievements
  FOR UPDATE USING (auth.uid() = user_id);

-- Water logs policies
CREATE POLICY "Users can manage their own water logs" ON public.water_logs
  FOR ALL USING (auth.uid() = user_id);

-- Mood entries policies
CREATE POLICY "Users can manage their own mood entries" ON public.mood_entries
  FOR ALL USING (auth.uid() = user_id);

-- Meditation stats policies
CREATE POLICY "Users can manage their own meditation stats" ON public.meditation_stats
  FOR ALL USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can manage their own settings" ON public.settings
  FOR ALL USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.meditation_stats (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_fasting_sessions_user_id ON public.fasting_sessions(user_id);
CREATE INDEX idx_fasting_sessions_status ON public.fasting_sessions(status);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_water_logs_user_date ON public.water_logs(user_id, date);
CREATE INDEX idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX idx_mood_entries_created_at ON public.mood_entries(created_at DESC);