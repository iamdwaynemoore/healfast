export class BreathingWelcome {
  constructor() {
    this.userName = this.getUserName();
    this.sessionCount = this.getSessionCount();
    this.lastSession = this.getLastSessionDate();
    this.hasUsedBreathe = this.hasUsedBreathing();
  }
  
  getUserName() {
    // Try to get from user object first, then localStorage, then default
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Friend';
      }
    } catch (e) {
      console.warn('Could not parse stored user:', e);
    }
    
    return localStorage.getItem('userName') || 'Friend';
  }
  
  getSessionCount() {
    return parseInt(localStorage.getItem('breathingSessionCount') || '0');
  }
  
  getLastSessionDate() {
    const lastSession = localStorage.getItem('lastBreathingSession');
    return lastSession ? new Date(lastSession) : null;
  }
  
  hasUsedBreathing() {
    return localStorage.getItem('hasUsedBreathing') === 'true' || 
           this.sessionCount > 0;
  }
  
  getDaysSinceLastSession() {
    if (!this.lastSession) return Infinity;
    const now = new Date();
    const diffTime = Math.abs(now - this.lastSession);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  getTimeContextualMessage(baseMessage) {
    const hour = new Date().getHours();
    
    if (hour < 10) {
      return {
        ...baseMessage,
        subtitle: "Start your morning with mindful breathing"
      };
    } else if (hour > 20) {
      return {
        ...baseMessage,
        subtitle: "Wind down with gentle breathwork"
      };
    } else if (hour >= 12 && hour <= 14) {
      return {
        ...baseMessage,
        subtitle: "Take a midday pause to breathe"
      };
    }
    
    return baseMessage;
  }
  
  getFastingContextualMessage(fastingState) {
    if (!fastingState) return null;
    
    if (fastingState.isActiveFasting && fastingState.hours > 12) {
      return {
        greeting: `Breathe with intention, ${this.userName}`,
        subtitle: "Let your breath support your fasting journey",
        tone: 'fasting'
      };
    } else if (fastingState.justBrokeFast) {
      return {
        greeting: `Well done, ${this.userName}`,
        subtitle: "Celebrate your fast with mindful breathing",
        tone: 'celebration'
      };
    }
    
    return null;
  }
  
  getWelcomeMessage(fastingState = null) {
    // Check for fasting context first
    const fastingMessage = this.getFastingContextualMessage(fastingState);
    if (fastingMessage) {
      return this.getTimeContextualMessage(fastingMessage);
    }
    
    const daysSince = this.getDaysSinceLastSession();
    let baseMessage;
    
    // First time ever
    if (!this.hasUsedBreathe) {
      baseMessage = {
        greeting: `Welcome, ${this.userName}`,
        subtitle: "Let's begin your first breathing session",
        tone: 'introduction'
      };
    }
    // Returning after a long break
    else if (daysSince >= 7) {
      baseMessage = {
        greeting: `Good to see you, ${this.userName}`,
        subtitle: "Ready to reconnect with your breath?",
        tone: 'reunion'
      };
    }
    // New user (first few sessions)
    else if (this.sessionCount < 3) {
      baseMessage = {
        greeting: `Hello, ${this.userName}`,
        subtitle: "Ready for another mindful moment?",
        tone: 'encouraging'
      };
    }
    // Same day return
    else if (daysSince === 0) {
      baseMessage = {
        greeting: `Back again, ${this.userName}`,
        subtitle: "Another moment of mindfulness awaits",
        tone: 'familiar'
      };
    }
    // Regular user
    else {
      baseMessage = {
        greeting: `Welcome back, ${this.userName}`,
        subtitle: "Take a moment to breathe",
        tone: 'comfortable'
      };
    }
    
    return this.getTimeContextualMessage(baseMessage);
  }
  
  // Call after completing a session
  recordSession() {
    const newCount = this.sessionCount + 1;
    localStorage.setItem('breathingSessionCount', newCount.toString());
    localStorage.setItem('lastBreathingSession', new Date().toISOString());
    localStorage.setItem('hasUsedBreathing', 'true');
    
    // Update internal state
    this.sessionCount = newCount;
    this.lastSession = new Date();
    this.hasUsedBreathe = true;
    
    // Dispatch event for other components to listen to
    window.dispatchEvent(new CustomEvent('breathingSessionComplete', {
      detail: { sessionCount: newCount }
    }));
  }
  
  getSessionCompleteMessage() {
    const messages = [
      "Beautiful first session completed!",
      "Your second mindful moment, well done!",
      "Another wonderful breathing session!",
      `${this.sessionCount} sessions of self-care completed!`
    ];
    
    return this.sessionCount <= 3 ? 
      messages[this.sessionCount - 1] : 
      messages[3];
  }
}