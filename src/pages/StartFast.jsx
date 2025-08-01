import React, { useState } from "react";
import { FastingSession } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { addHours } from "date-fns";
import Logo from '@/components/Logo';

const FASTING_TYPES = [
  {
    id: 'water',
    name: 'Water Fast',
    description: 'Pure water only',
    durations: [16, 24, 48, 72],
    popular: 24
  },
  {
    id: 'dry',
    name: 'Dry Fast',
    description: 'No food or water',
    durations: [12, 16, 20, 24],
    popular: 16
  },
  {
    id: 'intermittent',
    name: 'Intermittent',
    description: 'Time-restricted',
    protocols: ['16:8', '18:6', '20:4', 'OMAD'],
    durations: [16, 18, 20, 23],
    popular: 16
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
                    className={`w-full p-6 rounded-2xl border transition-all duration-300 ${
                      selectedType === type.id
                        ? 'bg-white/10 border-white/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-left">
                      <h3 className="text-white text-lg font-light mb-1">
                        {type.name}
                      </h3>
                      <p className="text-white/40 text-sm">
                        {type.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            {selectedType && selectedTypeData && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-white/60 text-xs font-light tracking-[0.3em] uppercase text-center">
                  Select Duration
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