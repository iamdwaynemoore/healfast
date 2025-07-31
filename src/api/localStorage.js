// LocalStorage-based API to replace Base44 SDK

// Generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Helper to get data from localStorage
const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

// Helper to save data to localStorage
const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// FastingSession CRUD operations
export const FastingSession = {
  async create(data) {
    const sessions = getStorageData('fastingSessions');
    const newSession = {
      id: generateId(),
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    sessions.push(newSession);
    setStorageData('fastingSessions', sessions);
    return newSession;
  },

  async list(orderBy = '-created_date', limit = 10) {
    let sessions = getStorageData('fastingSessions');
    
    // Sort sessions
    const isDescending = orderBy.startsWith('-');
    const field = isDescending ? orderBy.substring(1) : orderBy;
    
    sessions.sort((a, b) => {
      if (isDescending) {
        return new Date(b[field]) - new Date(a[field]);
      }
      return new Date(a[field]) - new Date(b[field]);
    });
    
    // Apply limit
    if (limit) {
      sessions = sessions.slice(0, limit);
    }
    
    return sessions;
  },

  async update(id, data) {
    const sessions = getStorageData('fastingSessions');
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      sessions[index] = {
        ...sessions[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      setStorageData('fastingSessions', sessions);
      return sessions[index];
    }
    throw new Error('FastingSession not found');
  },

  async delete(id) {
    const sessions = getStorageData('fastingSessions');
    const filtered = sessions.filter(s => s.id !== id);
    setStorageData('fastingSessions', filtered);
    return { success: true };
  }
};

// UserProfile CRUD operations
export const UserProfile = {
  async create(data) {
    const profiles = getStorageData('userProfiles');
    const newProfile = {
      id: generateId(),
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    profiles.push(newProfile);
    setStorageData('userProfiles', profiles);
    return newProfile;
  },

  async list() {
    return getStorageData('userProfiles');
  },

  async update(id, data) {
    const profiles = getStorageData('userProfiles');
    const index = profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      profiles[index] = {
        ...profiles[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      setStorageData('userProfiles', profiles);
      return profiles[index];
    }
    throw new Error('UserProfile not found');
  }
};

// WaterLog CRUD operations
export const WaterLog = {
  async create(data) {
    const logs = getStorageData('waterLogs');
    const newLog = {
      id: generateId(),
      ...data,
      created_date: new Date().toISOString()
    };
    logs.push(newLog);
    setStorageData('waterLogs', logs);
    return newLog;
  },

  async list(orderBy = '-created_date', limit = 100) {
    let logs = getStorageData('waterLogs');
    
    // Sort logs
    const isDescending = orderBy.startsWith('-');
    const field = isDescending ? orderBy.substring(1) : orderBy;
    
    logs.sort((a, b) => {
      if (isDescending) {
        return new Date(b[field]) - new Date(a[field]);
      }
      return new Date(a[field]) - new Date(b[field]);
    });
    
    // Apply limit
    if (limit) {
      logs = logs.slice(0, limit);
    }
    
    return logs;
  },

  async delete(id) {
    const logs = getStorageData('waterLogs');
    const filtered = logs.filter(l => l.id !== id);
    setStorageData('waterLogs', filtered);
    return { success: true };
  }
};

// Affirmation - static data
const affirmations = [
  { id: '1', text: 'Every hour of fasting is a step toward better health.' },
  { id: '2', text: 'Your body is designed to heal itself - trust the process.' },
  { id: '3', text: 'You are stronger than any craving.' },
  { id: '4', text: 'This temporary discomfort leads to lasting benefits.' },
  { id: '5', text: 'Your willpower grows stronger with each passing moment.' },
  { id: '6', text: 'You are giving your body the gift of healing.' },
  { id: '7', text: 'Every cell in your body is renewing itself.' },
  { id: '8', text: 'You have the power to transform your health.' },
  { id: '9', text: 'Listen to your body - it knows how to heal.' },
  { id: '10', text: 'You are not depriving yourself, you are empowering yourself.' }
];

export const Affirmation = {
  async list() {
    return affirmations;
  }
};

// User authentication - enhanced for login system
export const User = {
  async me() {
    // Return the current user from localStorage
    try {
      const user = localStorage.getItem('currentUser');
      if (user) {
        return JSON.parse(user);
      }
    } catch (error) {
      console.error('Error parsing current user:', error);
    }
    throw new Error('Not authenticated');
  },

  async signIn(email, password) {
    // Mock sign in - in a real app, this would validate credentials
    const users = getStorageData('users');
    const user = users.find(u => u.email === email);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid credentials');
  },

  async signUp(email, password, name) {
    // Mock sign up - in a real app, this would create account on server
    const users = getStorageData('users');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      full_name: name,
      onboarding_completed: false,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    setStorageData('users', users);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return newUser;
  },

  async signOut() {
    // Sign out the current user
    localStorage.removeItem('currentUser');
    return { success: true };
  },

  async update(id, data) {
    const users = getStorageData('users');
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      setStorageData('users', users);
      
      // Update current user if it's the same user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.id === id) {
        localStorage.setItem('currentUser', JSON.stringify(users[index]));
      }
      
      return users[index];
    }
    throw new Error('User not found');
  },

  async create(data) {
    const users = getStorageData('users');
    const newUser = {
      id: generateId(),
      onboarding_completed: false,
      ...data,
      created_date: new Date().toISOString()
    };
    users.push(newUser);
    setStorageData('users', users);
    return newUser;
  },

  isAuthenticated() {
    return !!localStorage.getItem('currentUser');
  }
};

// Achievement - not implemented yet but exported for compatibility
export const Achievement = {
  async list() {
    return [];
  }
};