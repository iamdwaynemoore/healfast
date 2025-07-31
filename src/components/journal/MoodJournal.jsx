import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Battery, Brain, Heart, TrendingUp, Calendar } from 'lucide-react';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { toast } from 'sonner';

const MOOD_OPTIONS = [
  { id: 'excellent', emoji: '😊', label: 'Excellent', value: 5, color: '#22c55e' },
  { id: 'good', emoji: '🙂', label: 'Good', value: 4, color: '#3b82f6' },
  { id: 'okay', emoji: '😐', label: 'Okay', value: 3, color: '#f59e0b' },
  { id: 'tired', emoji: '😴', label: 'Tired', value: 2, color: '#f97316' },
  { id: 'struggling', emoji: '😔', label: 'Struggling', value: 1, color: '#ef4444' }
];

const ENERGY_LEVELS = [
  { id: 'high', label: 'High Energy', value: 3, icon: '⚡' },
  { id: 'moderate', label: 'Moderate', value: 2, icon: '🔋' },
  { id: 'low', label: 'Low Energy', value: 1, icon: '🪫' }
];

const SYMPTOMS = [
  { id: 'hunger', label: 'Hunger', icon: '🍴' },
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'fatigue', label: 'Fatigue', icon: '😴' },
  { id: 'irritable', label: 'Irritable', icon: '😤' },
  { id: 'focused', label: 'Focused', icon: '🎯' },
  { id: 'energized', label: 'Energized', icon: '💪' },
  { id: 'calm', label: 'Calm', icon: '🧘' },
  { id: 'happy', label: 'Happy', icon: '😊' }
];

export default function MoodJournal({ userId, onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [journalNote, setJournalNote] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [viewMode, setViewMode] = useState('entry'); // 'entry' or 'history'

  useEffect(() => {
    loadJournalEntries();
  }, [userId]);

  const loadJournalEntries = () => {
    const entries = JSON.parse(localStorage.getItem(`mood-journal-${userId}`) || '[]');
    setJournalEntries(entries);
    
    // Load today's entry if exists
    const todayEntry = entries.find(entry => 
      isSameDay(new Date(entry.date), new Date())
    );
    
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setSelectedEnergy(todayEntry.energy);
      setSelectedSymptoms(todayEntry.symptoms || []);
      setJournalNote(todayEntry.note || '');
    }
  };

  const saveEntry = () => {
    if (!selectedMood || !selectedEnergy) {
      toast.error('Please select both mood and energy level');
      return;
    }

    const entry = {
      id: Date.now(),
      date: selectedDate.toISOString(),
      mood: selectedMood,
      energy: selectedEnergy,
      symptoms: selectedSymptoms,
      note: journalNote,
      timestamp: new Date().toISOString()
    };

    // Update or add entry
    const entries = [...journalEntries];
    const existingIndex = entries.findIndex(e => 
      isSameDay(new Date(e.date), selectedDate)
    );

    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }

    // Sort by date descending
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save to localStorage
    localStorage.setItem(`mood-journal-${userId}`, JSON.stringify(entries));
    setJournalEntries(entries);

    toast.success('Mood entry saved!');
    
    // Reset form
    setSelectedMood(null);
    setSelectedEnergy(null);
    setSelectedSymptoms([]);
    setJournalNote('');
  };

  const getMoodData = (moodId) => {
    return MOOD_OPTIONS.find(m => m.id === moodId);
  };

  const getEnergyData = (energyId) => {
    return ENERGY_LEVELS.find(e => e.id === energyId);
  };

  const calculateWeekStats = () => {
    const weekStart = startOfWeek(new Date());
    const weekEntries = journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart;
    });

    if (weekEntries.length === 0) return null;

    const avgMood = weekEntries.reduce((sum, e) => {
      const mood = getMoodData(e.mood);
      return sum + (mood?.value || 0);
    }, 0) / weekEntries.length;

    const avgEnergy = weekEntries.reduce((sum, e) => {
      const energy = getEnergyData(e.energy);
      return sum + (energy?.value || 0);
    }, 0) / weekEntries.length;

    return { avgMood, avgEnergy, count: weekEntries.length };
  };

  const weekStats = calculateWeekStats();

  if (viewMode === 'history') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white/80 text-lg font-light">Mood History</h3>
          <button
            onClick={() => setViewMode('entry')}
            className="text-white/60 text-sm hover:text-white/80 transition-colors"
          >
            New Entry
          </button>
        </div>

        {/* Week Stats */}
        {weekStats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="backdrop-blur-md border border-white/10 rounded-xl p-3">
              <p className="text-white/60 text-xs mb-1">Avg Mood</p>
              <p className="text-white text-xl font-light">{weekStats.avgMood.toFixed(1)}/5</p>
            </div>
            <div className="backdrop-blur-md border border-white/10 rounded-xl p-3">
              <p className="text-white/60 text-xs mb-1">Avg Energy</p>
              <p className="text-white text-xl font-light">{weekStats.avgEnergy.toFixed(1)}/3</p>
            </div>
            <div className="backdrop-blur-md border border-white/10 rounded-xl p-3">
              <p className="text-white/60 text-xs mb-1">Entries</p>
              <p className="text-white text-xl font-light">{weekStats.count}</p>
            </div>
          </div>
        )}

        {/* Mood Graph - Week View */}
        <div className="backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <p className="text-white/60 text-xs mb-4">This Week's Mood</p>
          <div className="grid grid-cols-7 gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
              const date = addDays(startOfWeek(new Date()), dayOffset);
              const entry = journalEntries.find(e => isSameDay(new Date(e.date), date));
              const mood = entry ? getMoodData(entry.mood) : null;
              
              return (
                <div key={dayOffset} className="text-center">
                  <p className="text-white/40 text-xs mb-2">
                    {format(date, 'EEE')}
                  </p>
                  <div 
                    className={`w-10 h-10 mx-auto rounded-full border flex items-center justify-center transition-all ${
                      isToday(date) ? 'border-white/40' : 'border-white/10'
                    }`}
                    style={{
                      backgroundColor: mood ? `${mood.color}20` : 'transparent',
                      borderColor: mood ? `${mood.color}40` : undefined
                    }}
                  >
                    {mood ? (
                      <span className="text-sm">{mood.emoji}</span>
                    ) : (
                      <span className="text-white/20 text-xs">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Entry List */}
        <div className="space-y-3">
          <h4 className="text-white/60 text-sm">Recent Entries</h4>
          {journalEntries.slice(0, 7).map(entry => {
            const mood = getMoodData(entry.mood);
            const energy = getEnergyData(entry.energy);
            
            return (
              <div 
                key={entry.id}
                className="backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/5 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mood?.emoji}</span>
                    <div>
                      <p className="text-white text-sm">
                        {format(new Date(entry.date), 'EEEE, MMM d')}
                      </p>
                      <p className="text-white/40 text-xs">
                        {mood?.label} • {energy?.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.symptoms?.slice(0, 3).map(symptomId => {
                      const symptom = SYMPTOMS.find(s => s.id === symptomId);
                      return symptom ? (
                        <span key={symptomId} className="text-sm" title={symptom.label}>
                          {symptom.icon}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                {entry.note && (
                  <p className="text-white/60 text-xs italic">"{entry.note}"</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white/80 text-lg font-light">How are you feeling?</h3>
        <button
          onClick={() => setViewMode('history')}
          className="text-white/60 text-sm hover:text-white/80 transition-colors flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          History
        </button>
      </div>

      {/* Date Selector */}
      <div className="backdrop-blur-md border border-white/10 rounded-xl p-3">
        <p className="text-white/60 text-xs mb-2">Logging for</p>
        <p className="text-white text-sm">
          {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
        </p>
      </div>

      {/* Mood Selection */}
      <div className="space-y-3">
        <p className="text-white/60 text-sm">Mood</p>
        <div className="flex gap-3 justify-between">
          {MOOD_OPTIONS.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex-1 p-3 rounded-xl border transition-all ${
                selectedMood === mood.id
                  ? 'border-white/30 bg-white/10 scale-105'
                  : 'border-white/10 hover:bg-white/5'
              }`}
              style={{
                backgroundColor: selectedMood === mood.id ? `${mood.color}20` : undefined,
                borderColor: selectedMood === mood.id ? `${mood.color}40` : undefined
              }}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <p className="text-white/60 text-[10px]">{mood.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level */}
      <div className="space-y-3">
        <p className="text-white/60 text-sm">Energy Level</p>
        <div className="grid grid-cols-3 gap-3">
          {ENERGY_LEVELS.map(energy => (
            <button
              key={energy.id}
              onClick={() => setSelectedEnergy(energy.id)}
              className={`p-3 rounded-xl border transition-all ${
                selectedEnergy === energy.id
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="text-xl mb-1">{energy.icon}</div>
              <p className="text-white/60 text-xs">{energy.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-3">
        <p className="text-white/60 text-sm">Symptoms & Feelings</p>
        <div className="grid grid-cols-4 gap-2">
          {SYMPTOMS.map(symptom => (
            <button
              key={symptom.id}
              onClick={() => {
                setSelectedSymptoms(prev =>
                  prev.includes(symptom.id)
                    ? prev.filter(id => id !== symptom.id)
                    : [...prev, symptom.id]
                );
              }}
              className={`p-2 rounded-lg border transition-all ${
                selectedSymptoms.includes(symptom.id)
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="text-lg mb-1">{symptom.icon}</div>
              <p className="text-white/60 text-[10px]">{symptom.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Journal Note */}
      <div className="space-y-3">
        <p className="text-white/60 text-sm">Notes (optional)</p>
        <textarea
          value={journalNote}
          onChange={(e) => setJournalNote(e.target.value)}
          placeholder="How's your fasting journey going?"
          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all resize-none"
          rows="3"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveEntry}
        disabled={!selectedMood || !selectedEnergy}
        className="w-full py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 rounded-xl text-white font-light hover:from-purple-500/30 hover:to-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Entry
      </button>
    </div>
  );
}