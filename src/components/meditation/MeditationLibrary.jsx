import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, Heart, Brain, Sparkles, Headphones, Wind, Waves } from 'lucide-react';
import { toast } from 'sonner';

const MEDITATION_CATEGORIES = [
  {
    id: 'hunger_relief',
    name: 'Hunger Relief',
    description: 'Manage fasting cravings',
    icon: <Brain className="w-5 h-5" />,
    color: '#8b5cf6'
  },
  {
    id: 'energy_boost',
    name: 'Energy Boost',
    description: 'Revitalize during fasts',
    icon: <Sparkles className="w-5 h-5" />,
    color: '#f59e0b'
  },
  {
    id: 'deep_rest',
    name: 'Deep Rest',
    description: 'Recovery & healing',
    icon: <Wind className="w-5 h-5" />,
    color: '#06b6d4'
  },
  {
    id: 'mindful_eating',
    name: 'Mindful Eating',
    description: 'Breaking fast consciously',
    icon: <Heart className="w-5 h-5" />,
    color: '#ec4899'
  }
];

const MEDITATIONS = [
  // Hunger Relief
  {
    id: 'hunger_wave_1',
    title: 'Riding the Hunger Wave',
    duration: 5,
    category: 'hunger_relief',
    description: 'Transform hunger sensations into awareness',
    audioUrl: '/meditations/hunger-wave.mp3',
    premium: false,
    plays: 1234,
    rating: 4.8
  },
  {
    id: 'craving_dissolution',
    title: 'Craving Dissolution',
    duration: 10,
    category: 'hunger_relief',
    description: 'Dissolve cravings through mindful observation',
    audioUrl: '/meditations/craving-dissolution.mp3',
    premium: false,
    plays: 892,
    rating: 4.9
  },
  {
    id: 'stomach_calm',
    title: 'Stomach Soothing Journey',
    duration: 15,
    category: 'hunger_relief',
    description: 'Calm digestive system through visualization',
    audioUrl: '/meditations/stomach-calm.mp3',
    premium: true,
    plays: 567,
    rating: 4.7
  },
  
  // Energy Boost
  {
    id: 'morning_activation',
    title: 'Morning Fast Activation',
    duration: 7,
    category: 'energy_boost',
    description: 'Energize your fasted morning state',
    audioUrl: '/meditations/morning-activation.mp3',
    premium: false,
    plays: 2103,
    rating: 4.9
  },
  {
    id: 'midday_recharge',
    title: 'Midday Energy Recharge',
    duration: 10,
    category: 'energy_boost',
    description: 'Beat the afternoon slump while fasting',
    audioUrl: '/meditations/midday-recharge.mp3',
    premium: false,
    plays: 1567,
    rating: 4.8
  },
  {
    id: 'cellular_vitality',
    title: 'Cellular Vitality Boost',
    duration: 20,
    category: 'energy_boost',
    description: 'Visualize cellular regeneration and energy',
    audioUrl: '/meditations/cellular-vitality.mp3',
    premium: true,
    plays: 789,
    rating: 5.0
  },
  
  // Deep Rest
  {
    id: 'fasting_sleep',
    title: 'Fasting Sleep Preparation',
    duration: 15,
    category: 'deep_rest',
    description: 'Prepare for restful sleep while fasting',
    audioUrl: '/meditations/fasting-sleep.mp3',
    premium: false,
    plays: 3421,
    rating: 4.9
  },
  {
    id: 'body_scan_rest',
    title: 'Deep Body Scan for Fasters',
    duration: 20,
    category: 'deep_rest',
    description: 'Progressive relaxation for fasted state',
    audioUrl: '/meditations/body-scan-rest.mp3',
    premium: false,
    plays: 2134,
    rating: 4.8
  },
  {
    id: 'healing_rest',
    title: 'Autophagy Healing Rest',
    duration: 30,
    category: 'deep_rest',
    description: 'Support cellular healing through deep rest',
    audioUrl: '/meditations/healing-rest.mp3',
    premium: true,
    plays: 1234,
    rating: 5.0
  },
  
  // Mindful Eating
  {
    id: 'breaking_fast',
    title: 'Breaking Fast Mindfully',
    duration: 8,
    category: 'mindful_eating',
    description: 'Prepare to break your fast with intention',
    audioUrl: '/meditations/breaking-fast.mp3',
    premium: false,
    plays: 1876,
    rating: 4.7
  },
  {
    id: 'gratitude_meal',
    title: 'Gratitude Before Eating',
    duration: 5,
    category: 'mindful_eating',
    description: 'Cultivate appreciation for nourishment',
    audioUrl: '/meditations/gratitude-meal.mp3',
    premium: false,
    plays: 2345,
    rating: 4.9
  },
  {
    id: 'conscious_nourishment',
    title: 'Conscious Nourishment Journey',
    duration: 12,
    category: 'mindful_eating',
    description: 'Transform eating into a sacred practice',
    audioUrl: '/meditations/conscious-nourishment.mp3',
    premium: true,
    plays: 987,
    rating: 4.8
  }
];

export default function MeditationLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingId, setPlayingId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load favorites and recently played from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('meditation-favorites') || '[]');
    const savedRecent = JSON.parse(localStorage.getItem('meditation-recent') || '[]');
    setFavorites(savedFavorites);
    setRecentlyPlayed(savedRecent);
  }, []);

  const filteredMeditations = MEDITATIONS.filter(meditation => {
    const matchesCategory = selectedCategory === 'all' || meditation.category === selectedCategory;
    const matchesSearch = meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meditation.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlay = (meditation) => {
    if (playingId === meditation.id) {
      setPlayingId(null);
      // In real app, pause audio
    } else {
      setPlayingId(meditation.id);
      // In real app, play audio
      
      // Add to recently played
      const newRecent = [meditation.id, ...recentlyPlayed.filter(id => id !== meditation.id)].slice(0, 5);
      setRecentlyPlayed(newRecent);
      localStorage.setItem('meditation-recent', JSON.stringify(newRecent));
      
      toast.success(`Now playing: ${meditation.title}`);
    }
  };

  const toggleFavorite = (meditationId) => {
    const newFavorites = favorites.includes(meditationId)
      ? favorites.filter(id => id !== meditationId)
      : [...favorites, meditationId];
    
    setFavorites(newFavorites);
    localStorage.setItem('meditation-favorites', JSON.stringify(newFavorites));
  };

  const getCategoryById = (categoryId) => {
    return MEDITATION_CATEGORIES.find(cat => cat.id === categoryId);
  };

  const MeditationCard = ({ meditation }) => {
    const category = getCategoryById(meditation.category);
    const isFavorite = favorites.includes(meditation.id);
    const isPlaying = playingId === meditation.id;
    
    return (
      <div
        className={`relative backdrop-blur-md border rounded-2xl p-4 transition-all duration-300 ${
          isPlaying 
            ? 'border-white/30 bg-white/10 scale-[1.02]' 
            : 'border-white/10 bg-white/5 hover:bg-white/10'
        }`}
        style={{
          boxShadow: isPlaying ? `0 0 30px ${category.color}20` : 'none',
        }}
      >
        <div className="flex items-start gap-4">
          {/* Play Button */}
          <button
            onClick={() => handlePlay(meditation)}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
              isPlaying 
                ? 'bg-gradient-to-br from-white/20 to-white/10' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
            style={{
              boxShadow: isPlaying ? `0 0 20px ${category.color}30` : 'none',
            }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" style={{ marginLeft: '2px' }} />
            )}
          </button>
          
          {/* Content */}
          <div className="flex-grow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-white font-light text-sm mb-1">{meditation.title}</h4>
                <p className="text-white/60 text-xs leading-relaxed">{meditation.description}</p>
              </div>
              <button
                onClick={() => toggleFavorite(meditation.id)}
                className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <Heart 
                  className={`w-4 h-4 transition-all ${
                    isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white/40'
                  }`} 
                />
              </button>
            </div>
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-white/40">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{meditation.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                <span>{meditation.plays.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⭐ {meditation.rating}</span>
              </div>
              {meditation.premium && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded-full text-[10px]">
                  PRO
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Playing Indicator */}
        {isPlaying && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"
                style={{ width: '40%' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search meditations..."
          className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-all"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-light whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-white/20 text-white border border-white/20'
              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
          }`}
        >
          All Meditations
        </button>
        {MEDITATION_CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-xs font-light whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-white/20 text-white border border-white/20'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            <span style={{ color: selectedCategory === category.id ? category.color : undefined }}>
              {category.icon}
            </span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <div className="space-y-3">
          <h3 className="text-white/80 text-sm font-light">Recently Played</h3>
          <div className="space-y-2">
            {recentlyPlayed.slice(0, 3).map(id => {
              const meditation = MEDITATIONS.find(m => m.id === id);
              return meditation ? <MeditationCard key={id} meditation={meditation} /> : null;
            })}
          </div>
        </div>
      )}

      {/* Main Meditation List */}
      <div className="space-y-3">
        <h3 className="text-white/80 text-sm font-light">
          {selectedCategory === 'all' ? 'All Meditations' : getCategoryById(selectedCategory)?.name}
        </h3>
        <div className="space-y-2">
          {filteredMeditations.map(meditation => (
            <MeditationCard key={meditation.id} meditation={meditation} />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredMeditations.length === 0 && (
        <div className="text-center py-12">
          <Waves className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm">No meditations found</p>
          <p className="text-white/30 text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}