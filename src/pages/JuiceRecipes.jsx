import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Droplets, Leaf, Heart } from 'lucide-react';
import Logo from '@/components/Logo';

const alkalizingJuices = [
  {
    title: "Classic Green Detox",
    description: "The ultimate alkalizing tonic",
    ingredients: ['1 Cucumber', '4 Celery Stalks', '2 cups Spinach', '1/2 Lemon', '1-inch Ginger'],
    instructions: ['Wash all produce thoroughly.', 'Juice cucumber, celery, and spinach.', 'Juice lemon and ginger separately.', 'Mix well and serve immediately.'],
    color: 'green',
    icon: <Leaf className="w-5 h-5" />
  },
  {
    title: "Parsley Power-Up",
    description: "Rich in chlorophyll and vitamin K",
    ingredients: ['1 bunch Parsley', '1 Green Apple', '1/2 Cucumber', '1 Lime'],
    instructions: ['Wash all produce.', 'Juice parsley, apple, and cucumber together.', 'Squeeze in lime juice.', 'Stir and enjoy.'],
    color: 'green',
    icon: <Leaf className="w-5 h-5" />
  },
  {
    title: "Fennel & Pear Cooler",
    description: "A uniquely sweet and soothing blend",
    ingredients: ['1 Fennel Bulb', '2 Pears', '1/2 cup Mint leaves', '1/2 Lime'],
    instructions: ['Wash all produce.', 'Juice fennel and pears.', 'Add mint leaves and juice.', 'Finish with a squeeze of lime.'],
    color: 'green',
    icon: <Leaf className="w-5 h-5" />
  },
  {
    title: "Zucchini Greenade",
    description: "Hydrating and low in natural sugars",
    ingredients: ['2 Zucchinis', '1 cup Kale', '1 Green Bell Pepper', '1/2 Lemon'],
    instructions: ['Wash all vegetables.', 'Core the bell pepper.', 'Juice zucchini, kale, and bell pepper.', 'Add lemon juice and serve chilled.'],
    color: 'green',
    icon: <Leaf className="w-5 h-5" />
  },
];

const bloodFlowJuices = [
  {
    title: "Earthy Beetroot Boost",
    description: "Nitrate-rich for improved blood flow",
    ingredients: ['1 medium Beetroot', '2 Carrots', '1 Apple', '1/2 Lemon'],
    instructions: ['Wash and peel beetroot and carrots.', 'Core the apple.', 'Juice beetroot, carrots, and apple.', 'Add lemon juice and stir.'],
    color: 'red',
    icon: <Heart className="w-5 h-5" />
  },
  {
    title: "Citrus Ginger Zing",
    description: "Anti-inflammatory and circulation support",
    ingredients: ['2 Oranges', '1 Grapefruit', '1-inch Ginger', 'Pinch of Turmeric'],
    instructions: ['Peel oranges and grapefruit.', 'Juice the citrus fruits and ginger.', 'Stir in a pinch of turmeric.', 'Serve over ice if desired.'],
    color: 'red',
    icon: <Heart className="w-5 h-5" />
  },
  {
    title: "Pomegranate Ruby Red",
    description: "Potent antioxidants for heart health",
    ingredients: ['Seeds from 1 Pomegranate', '1 cup Red Grapes', '1/2 Beetroot'],
    instructions: ['Juice pomegranate seeds and red grapes.', 'Wash and juice the beetroot.', 'Combine juices and serve fresh.'],
    color: 'red',
    icon: <Heart className="w-5 h-5" />
  },
  {
    title: "Watermelon Mint Refresher",
    description: "Contains L-citrulline to relax blood vessels",
    ingredients: ['2 cups Watermelon chunks', '1/2 cup Mint leaves', '1 Lime'],
    instructions: ['Juice the watermelon chunks.', 'Add mint leaves and juice again.', 'Squeeze in fresh lime juice.', 'Serve chilled for best taste.'],
    color: 'red',
    icon: <Heart className="w-5 h-5" />
  },
];

export default function JuiceRecipes() {
  const navigate = useNavigate();
  const [selectedJuice, setSelectedJuice] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const JuiceCard = ({ juice, index }) => {
    const isGreen = juice.color === 'green';
    
    return (
      <div
        onClick={() => setSelectedJuice(juice)}
        className="group cursor-pointer"
        style={{
          animation: `fadeInUp 0.8s ease-out ${index * 0.1}s forwards`,
          opacity: 0,
        }}
      >
        <div 
          className="relative backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            boxShadow: isGreen 
              ? '0 0 30px rgba(74, 222, 128, 0.1), inset 0 0 20px rgba(74, 222, 128, 0.03)'
              : '0 0 30px rgba(239, 68, 68, 0.1), inset 0 0 20px rgba(239, 68, 68, 0.03)',
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: isGreen 
                  ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.2))'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(236, 72, 153, 0.2))',
              }}
            >
              <div className={isGreen ? 'text-green-400' : 'text-red-400'}>
                {juice.icon}
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="text-white font-light text-lg mb-1 group-hover:text-white/90 transition-colors">
                {juice.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {juice.description}
              </p>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                <Droplets className="w-3 h-3" />
                <span>{juice.ingredients.length} ingredients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RecipeModal = ({ juice, onClose }) => {
    if (!juice) return null;
    const isGreen = juice.color === 'green';
    
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7))',
            boxShadow: isGreen 
              ? '0 0 50px rgba(74, 222, 128, 0.2)'
              : '0 0 50px rgba(239, 68, 68, 0.2)',
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: isGreen 
                  ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.2))'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(236, 72, 153, 0.2))',
              }}
            >
              <div className={isGreen ? 'text-green-400' : 'text-red-400'} style={{ transform: 'scale(1.5)' }}>
                {juice.icon}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-light text-white mb-1">{juice.title}</h2>
              <p className="text-white/60">{juice.description}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-light text-lg mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {juice.ingredients.map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm border border-white/10 text-white/80 backdrop-blur-sm"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-light text-lg mb-3">Instructions</h3>
              <ol className="space-y-3">
                {juice.instructions.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        background: isGreen 
                          ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.2))'
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(236, 72, 153, 0.2))',
                        color: isGreen ? '#4ade80' : '#ef4444',
                      }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-white/80 text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover opacity-20"
            src="/water-swirl.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full overflow-y-auto pb-32">
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Logo size="sm" className="opacity-50" />
            </div>
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate(createPageUrl("Nutrition"))}
                className="w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:bg-white/10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                }}
              >
                <ArrowLeft className="w-4 h-4 text-white/70" />
              </button>
              <div>
                <h1 className="text-3xl font-extralight text-white">Prep Juices</h1>
                <p className="text-white/40 text-sm font-light">Simple recipes to support your fast</p>
              </div>
            </div>

            {/* Alkalizing Juices */}
            <div className="mb-12">
              <h2 className="text-xl font-extralight text-white/80 mb-6 flex items-center gap-3">
                <div className="w-8 h-[1px] bg-gradient-to-r from-green-400/50 to-transparent" />
                Alkalizing & Cleansing
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {alkalizingJuices.map((juice, index) => (
                  <JuiceCard key={index} juice={juice} index={index} />
                ))}
              </div>
            </div>

            {/* Blood Flow Juices */}
            <div>
              <h2 className="text-xl font-extralight text-white/80 mb-6 flex items-center gap-3">
                <div className="w-8 h-[1px] bg-gradient-to-r from-red-400/50 to-transparent" />
                Blood Flow & Liver Support
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {bloodFlowJuices.map((juice, index) => (
                  <JuiceCard key={index} juice={juice} index={index + alkalizingJuices.length} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Modal */}
        <RecipeModal juice={selectedJuice} onClose={() => setSelectedJuice(null)} />

        {/* Navigation Footer - Ultra Minimal */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
          <div className="flex items-center justify-around max-w-lg mx-auto px-4 pb-8 pt-4">
            {/* Dashboard */}
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
    </>
  );
}