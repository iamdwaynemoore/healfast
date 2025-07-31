import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Leaf, Droplets, Clock, ChevronRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Nutrition() {
  const navigate = useNavigate();

  const preFastItems = [
    { 
      icon: '🥑', 
      title: 'Healthy Fats',
      items: ['Avocado', 'Olive Oil', 'Nuts & Seeds'],
      color: 'from-green-500/20 to-green-600/10'
    },
    { 
      icon: '🐟', 
      title: 'Clean Proteins',
      items: ['Wild Salmon', 'Organic Chicken', 'Plant-Based'],
      color: 'from-blue-500/20 to-blue-600/10'
    },
    { 
      icon: '🥬', 
      title: 'Living Greens',
      items: ['Spinach', 'Arugula', 'Kale'],
      color: 'from-emerald-500/20 to-emerald-600/10'
    }
  ];

  const breakingFastPhases = [
    { time: '0-1h', title: 'Gentle Start', desc: 'Warm water • Lemon • Bone broth' },
    { time: '2-4h', title: 'Soft Foods', desc: 'Fresh fruit • Smoothies • Coconut water' },
    { time: '4-8h', title: 'Light Meals', desc: 'Steamed vegetables • Salads • Avocado' },
    { time: 'Next Day', title: 'Full Nutrition', desc: 'Whole grains • Proteins • Complex meals' }
  ];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover opacity-20"
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
            <Logo size="sm" className="opacity-50" />
          </div>
          
          <div className="flex items-center gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-white/60" />
            </button>
            <div>
              <h1 className="text-white text-3xl font-light">Nutrition</h1>
              <p className="text-white/40 text-xs uppercase tracking-wider mt-1">Pre & Post-Fast Excellence</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Pre-Fast Section */}
            <div className="space-y-4">
              <div className="text-white/60 text-xs font-light tracking-widest uppercase">
                Preparation Ritual
              </div>
              
              {/* 48-72 Hours Before Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-light">48-72 Hours Before</h3>
                    <p className="text-white/40 text-xs">Prepare your body for the journey</p>
                  </div>
                </div>

                {/* Food Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {preFastItems.map((category, index) => (
                    <div 
                      key={index}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="text-2xl mb-3">{category.icon}</div>
                      <h4 className="text-white/80 text-sm font-medium mb-2">{category.title}</h4>
                      <ul className="space-y-1">
                        {category.items.map((item, i) => (
                          <li key={i} className="text-white/50 text-xs flex items-center gap-2">
                            <div className="w-1 h-1 bg-white/30 rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Avoid Section */}
                <div className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20">
                  <h4 className="text-red-400/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <span className="text-lg">⚠️</span> Avoid
                  </h4>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Processed foods • Refined sugars • Heavy meals • Excessive caffeine • Alcohol
                  </p>
                </div>
              </div>

              {/* Hydration Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-6 h-6 text-blue-400/80" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-light mb-2">Hydration Excellence</h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Elevate your water with Himalayan pink salt or premium electrolytes. 
                      This maintains mineral balance and prevents fatigue during your fast.
                    </p>
                  </div>
                </div>
                
                {/* Water animation effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-500/10 to-transparent" />
              </div>
            </div>

            {/* Post-Fast Section */}
            <div className="space-y-4">
              <div className="text-white/60 text-xs font-light tracking-widest uppercase">
                Breaking Your Fast
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <span className="text-xl">🌅</span>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-light">Refeeding Timeline</h3>
                    <p className="text-white/40 text-xs">Go slow, be mindful</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {breakingFastPhases.map((phase, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 items-start"
                    >
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-400' : 'bg-white/20'
                        }`} />
                        {index < breakingFastPhases.length - 1 && (
                          <div className="w-px h-16 bg-white/10 mt-1" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-amber-400/80 text-xs font-medium">{phase.time}</span>
                          <h4 className="text-white/80 text-sm">{phase.title}</h4>
                        </div>
                        <p className="text-white/50 text-xs">{phase.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Juice Recipes CTA */}
            <button
              onClick={() => navigate(createPageUrl('JuiceRecipes'))}
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex items-center justify-between group hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <span className="text-xl">🥤</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white text-lg font-light">Juice Recipes</h3>
                  <p className="text-white/40 text-xs">Curated for optimal nutrition</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-all" />
            </button>

          </div>
        </div>

        {/* Navigation Footer - Matching Dashboard */}
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

            {/* Nutrition - Active */}
            <button
              className="p-3 text-white/80 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
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