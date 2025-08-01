import React, { useState } from "react";
import { FastingSession } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { addHours } from "date-fns";
import Logo from '@/components/Logo';

const FASTING_TYPES = [
  {
    id: 'intermittent',
    name: 'Intermittent Fasting',
    level: 'Beginner',
    levelColor: 'from-green-500/20 to-emerald-500/20',
    description: 'Time-restricted eating is the perfect entry point into fasting. By limiting your eating window, you give your digestive system a break while still enjoying daily meals. This method helps regulate insulin, boost mental clarity, and can lead to sustainable weight management.',
    protocols: ['16:8', '18:6', '20:4', 'OMAD'],
    durations: [16, 18, 20, 23],
    popular: 16,
    benefits: ['Improved insulin sensitivity', 'Enhanced mental focus', 'Sustainable weight loss', 'Better sleep quality']
  },
  {
    id: 'water',
    name: 'Water Fasting',
    level: 'Intermediate',
    levelColor: 'from-blue-500/20 to-cyan-500/20',
    description: 'A powerful healing protocol where only water is consumed. This allows your body to enter deeper states of autophagy, where cellular cleanup and regeneration occur. Water fasting has been practiced for millennia for both health and spiritual purposes.',
    durations: [24, 36, 48, 72],
    popular: 24,
    benefits: ['Deep autophagy activation', 'Cellular regeneration', 'Immune system reset', 'Mental clarity and spiritual insight']
  },
  {
    id: 'alternate',
    name: 'Alternate Day Fasting',
    level: 'Intermediate',
    levelColor: 'from-purple-500/20 to-pink-500/20',
    description: 'Cycle between fasting days and eating days to create a sustainable rhythm. On fasting days, consume minimal calories (500-600) or nothing at all. This method provides many benefits of extended fasting while allowing regular eating windows.',
    durations: [36, 36, 36, 36], // ADF is typically 36 hours cycles
    popular: 36,
    protocols: ['Complete fast', 'Modified (500 cal)', '5:2 Diet'],
    benefits: ['Significant weight loss', 'Improved metabolic flexibility', 'Reduced inflammation', 'Heart health improvement']
  },
  {
    id: 'dry',
    name: 'Dry Fasting',
    level: 'Advanced',
    levelColor: 'from-orange-500/20 to-red-500/20',
    description: 'The most intensive form of fasting where both food and water are restricted. This ancient practice accelerates the body\'s healing processes and should only be attempted by experienced fasters under proper guidance. Each hour of dry fasting equals approximately 3 hours of water fasting in terms of therapeutic effect.',
    durations: [12, 16, 20, 24],
    popular: 16,
    warning: 'Requires experience and careful monitoring',
    benefits: ['Accelerated autophagy', 'Rapid inflammation reduction', 'Enhanced mental clarity', 'Deep cellular detoxification']
  }
];

export default function StartFast() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedTypeData = FASTING_TYPES.find(t => t.id === selectedType);

  const handleStartFast = async () => {
    if (!selectedType || !selectedDuration) return;
    setShowConfirm(true);
  };

  const confirmStartFast = async () => {
    setIsStarting(true);

    try {
      const startTime = new Date();
      const endDateTime = addHours(startTime, selectedDuration);

      const fastData = {
        type: selectedType,
        protocol: selectedProtocol,
        start_time: startTime.toISOString(),
        planned_end_time: endDateTime.toISOString(),
        duration_hours: selectedDuration,
        status: 'active',
        notes: ''
      };

      await FastingSession.create(fastData);
      navigate(createPageUrl("ActiveTimer"));
    } catch (error) {
      console.error('Error starting fast:', error);
      alert(`Error starting fast: ${error.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover opacity-15"
          src="/water-swirl.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 pt-12">
          {/* Logo at top */}
          <div className="text-center mb-6">
            <Logo size="sm" className="opacity-40" />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="text-white/60 hover:text-white transition-all duration-300"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="text-center">
              <div className="text-white/40 text-xs font-light tracking-[0.3em] uppercase">
                Start Fast
              </div>
            </div>

            <div className="w-6" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="max-w-md mx-auto space-y-8">
            {/* Type Selection */}
            <div className="space-y-4">
              <h2 className="text-white/60 text-xs font-light tracking-[0.3em] uppercase text-center">
                Choose Your Method
              </h2>
              
              <div className="space-y-3">
                {FASTING_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id);
                      setSelectedDuration(null);
                      setSelectedProtocol(null);
                    }}
                    className={`w-full p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      selectedType === type.id
                        ? 'bg-white/10 border-white/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r ${type.levelColor} backdrop-blur-sm`}>
                      <span className="text-white text-xs font-medium">{type.level}</span>
                    </div>
                    <div className="text-left pr-20">
                      <h3 className="text-white text-lg font-light mb-2">
                        {type.name}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-3">
                        {type.description}
                      </p>
                      {type.warning && (
                        <p className="text-orange-400/80 text-xs italic mb-2">
                          ⚠️ {type.warning}
                        </p>
                      )}
                      {type.benefits && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Key Benefits</p>
                          <div className="flex flex-wrap gap-2">
                            {type.benefits.map((benefit, index) => (
                              <span key={index} className="text-white/50 text-xs bg-white/5 px-2 py-1 rounded-full">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            {selectedType && selectedTypeData && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-white/60 text-xs font-light tracking-[0.3em] uppercase text-center">
                  {selectedTypeData.protocols ? 'Select Protocol' : 'Select Duration'}
                </h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {selectedTypeData.protocols ? (
                    // Intermittent fasting protocols
                    selectedTypeData.protocols.map((protocol, index) => (
                      <button
                        key={protocol}
                        onClick={() => {
                          setSelectedDuration(selectedTypeData.durations[index]);
                          setSelectedProtocol(protocol);
                        }}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          selectedProtocol === protocol
                            ? 'bg-white text-black border-white'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="text-sm font-medium">{protocol}</div>
                        {selectedTypeData.durations[index] === selectedTypeData.popular && (
                          <div className="text-[10px] opacity-60 mt-1">Popular</div>
                        )}
                      </button>
                    ))
                  ) : (
                    // Regular fasting durations
                    selectedTypeData.durations.map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setSelectedDuration(duration)}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          selectedDuration === duration
                            ? 'bg-white text-black border-white'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="text-2xl font-light">{duration}h</div>
                        {duration === selectedTypeData.popular && (
                          <div className="text-[10px] opacity-60">Popular</div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Start Button */}
            {selectedType && selectedDuration && (
              <div className="pt-8 animate-in slide-in-from-bottom-4 duration-500">
                <button
                  onClick={handleStartFast}
                  disabled={isStarting}
                  className="w-full py-6 bg-white text-black rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  Begin Fast
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-sm w-full space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-white text-xl font-light">
                  Ready to Begin?
                </h3>
                <p className="text-white/60 text-sm font-light">
                  {selectedTypeData?.name} for {selectedDuration} hours
                </p>
                {selectedType === 'dry' && selectedDuration > 16 && (
                  <p className="text-amber-400/80 text-xs mt-2">
                    Extended dry fasting requires experience
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={confirmStartFast}
                  disabled={isStarting}
                  className="w-full py-4 bg-white text-black rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isStarting ? 'Starting...' : 'Start Fast'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 bg-transparent border border-white/20 text-white rounded-full font-light transition-all duration-300 hover:bg-white/5 hover:border-white/30"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
          <div className="flex items-center justify-around max-w-lg mx-auto px-4 pb-8 pt-4">
            {/* Today */}
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
      </div>
    </div>
  );
}