-- CHECK WHAT EXISTS AND COMPLETE SETUP

-- 1. First, let's see what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 2. If you see the tables listed, skip to step 3
-- If not, run this to create missing tables:

CREATE TABLE IF NOT EXISTS public.profiles (
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

CREATE TABLE IF NOT EXISTS public.fasting_sessions (
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

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  is_unlocked BOOLEAN DEFAULT false,
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  cups INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  mood_value INTEGER NOT NULL,
  energy_level TEXT NOT NULL,
  symptoms TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meditation_stats (
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

CREATE TABLE IF NOT EXISTS public.settings (
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

-- 3. Enable Row Level Security (safe to run even if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if any and recreate
-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Fasting sessions
DROP POLICY IF EXISTS "Users view own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users create own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users update own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users delete own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can view their own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can create their own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can update their own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can delete their own fasting sessions" ON public.fasting_sessions;

CREATE POLICY "Users view own fasting sessions" ON public.fasting_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own fasting sessions" ON public.fasting_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own fasting sessions" ON public.fasting_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own fasting sessions" ON public.fasting_sessions FOR DELETE USING (auth.uid() = user_id);

-- Other policies (simplified)
DROP POLICY IF EXISTS "Users view own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users create own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users update own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users manage own water logs" ON public.water_logs;
DROP POLICY IF EXISTS "Users manage own mood entries" ON public.mood_entries;
DROP POLICY IF EXISTS "Users manage own meditation stats" ON public.meditation_stats;
DROP POLICY IF EXISTS "Users manage own settings" ON public.settings;

CREATE POLICY "Users manage own achievements" ON public.achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own water logs" ON public.water_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own mood entries" ON public.mood_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own meditation stats" ON public.meditation_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own settings" ON public.settings FOR ALL USING (auth.uid() = user_id);

-- 5. Create indexes (IF NOT EXISTS prevents errors)
CREATE INDEX IF NOT EXISTS idx_fasting_sessions_user_id ON public.fasting_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_fasting_sessions_status ON public.fasting_sessions(status);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON public.water_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON public.mood_entries(created_at DESC);

-- Done! Check the first query results to see your tables