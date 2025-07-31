import { supabase } from '@/lib/supabase';

// User management
export const User = {
  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    try {
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
        throw error;
      }
      return data;
    } catch (err) {
      console.error('Caught error during sign in:', err);
      throw err;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (user) {
      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return {
        ...user,
        full_name: profile?.full_name || user.email
      };
    }
    
    return null;
  },

  async updateProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Fasting Sessions
export const FastingSession = {
  async create(sessionData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('fasting_sessions')
      .insert({
        ...sessionData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async list(orderBy = '-created_at', limit = 100) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const isDescending = orderBy.startsWith('-');
    const column = orderBy.replace('-', '');

    const { data, error } = await supabase
      .from('fasting_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order(column, { ascending: !isDescending })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async get(id) {
    const { data, error } = await supabase
      .from('fasting_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('fasting_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('fasting_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// User Profile
export const UserProfile = {
  async list() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id);

    if (error) throw error;
    return data || [];
  },

  async get(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(profileData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        ...profileData,
        id: user.id,
        email: user.email
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Achievements
export const Achievement = {
  async list() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  },

  async unlock(badgeId, progress = 100) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('achievements')
      .upsert({
        user_id: user.id,
        badge_id: badgeId,
        progress,
        is_unlocked: progress >= 100,
        unlocked_at: progress >= 100 ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProgress(badgeId, progress) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('achievements')
      .upsert({
        user_id: user.id,
        badge_id: badgeId,
        progress,
        is_unlocked: progress >= 100,
        unlocked_at: progress >= 100 ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Water Logs
export const WaterLog = {
  async getToday() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data || { cups: 0, date: today };
  },

  async updateToday(cups) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('water_logs')
      .upsert({
        user_id: user.id,
        date: today,
        cups,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getHistory(days = 7) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Mood Entries
export const MoodEntry = {
  async create(moodData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        ...moodData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async list(limit = 30) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getToday() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0] || null;
  }
};

// Meditation Stats
export const MeditationStats = {
  async get() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('meditation_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || {
      total_minutes: 0,
      sessions_completed: 0,
      current_streak: 0
    };
  },

  async update(stats) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('meditation_stats')
      .upsert({
        ...stats,
        user_id: user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Settings
export const Settings = {
  async get() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    // Return default settings if none exist
    return data || {
      notifications: {
        fastReminders: true,
        achievements: true,
        communityUpdates: false,
        moodReminders: true
      },
      theme: 'dark',
      units: {
        weight: 'lbs',
        height: 'ft',
        time: '12h'
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
    };
  },

  async update(settings) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('settings')
      .upsert({
        ...settings,
        user_id: user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Affirmations (kept in localStorage for now as they're not in the schema)
export const Affirmation = {
  async random() {
    const affirmations = [
      "Every hour of fasting makes me stronger",
      "My body is healing and renewing itself",
      "I am in control of my health journey",
      "This temporary hunger leads to lasting health",
      "I choose long-term wellness over short-term comfort"
    ];
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  }
};