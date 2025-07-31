
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf, Droplets, Soup, ArrowRight } from 'lucide-react';
import InfoCard from '../components/nutrition/InfoCard';
import RefeedTimeline from '../components/nutrition/RefeedTimeline';
import { Card, CardContent } from '@/components/ui/card';

export default function Nutrition() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-8 pb-32" style={{
      background: 'linear-gradient(180deg, #000000 0%, #0A0E15 60%, #1A2B5C 85%, #2C4AA0 100%)'
    }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-light gradient-text">Nourish & Prepare</h1>
              <p className="text-slate-400 text-sm">Your guide to pre & post-fast nutrition</p>
            </div>
          </div>
        </div>

        {/* Pre-Fast Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-slate-200 border-b border-border pb-2">Pre-Fast Preparation</h2>
          <InfoCard
            title="Eating for Success (2-3 Days Before)"
            icon={Leaf}
            focusItems={[
              'Healthy Fats: Avocado, olive oil, nuts, and seeds.',
              'Lean Protein: Chicken, fish, tofu, and legumes.',
              'Low-Carb Vegetables: Leafy greens, broccoli, zucchini.',
              'Hydrating Fruits: Berries, melon in moderation.',
            ]}
            avoidItems={[
              'Processed Foods & Sugar: Chips, cookies, soda.',
              'Refined Carbs: White bread, pasta, white rice.',
              'Heavy, greasy meals that are hard to digest.',
              'Excessive caffeine and alcohol.',
            ]}
          >
            Ease your body into a fast by eating clean, whole foods. This reduces cravings and makes the transition smoother.
          </InfoCard>

          <InfoCard
            title="Hydration is Key"
            icon={Droplets}
          >
            Drink plenty of water throughout the day. Add a pinch of sea salt or an electrolyte supplement to your water to maintain mineral balance, which can prevent headaches and fatigue during your fast.
          </InfoCard>
          
          <Card className="glass-morphism border-slate-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-light text-slate-300 mb-2">Simple Prep Juices</h3>
              <p className="text-slate-400 mb-4">
                Juicing before a fast can provide your body with easily digestible nutrients and help ease the transition. Explore our simple recipes.
              </p>
              <Button onClick={() => navigate(createPageUrl('JuiceRecipes'))} className="bg-primary hover:bg-primary/90">
                Explore Juice Recipes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Post-Fast Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-slate-200 border-b border-border pb-2">Post-Fast Refeeding</h2>
          <InfoCard
            title="Breaking Your Fast: Go Slow"
            icon={Soup}
            avoidItems={[
              'Heavy, fatty, or fried foods.',
              'Sugary drinks and desserts.',
              'Large, heavy meals.',
              'Alcohol and processed foods.',
              'Raw cruciferous vegetables (can be harsh initially).',
            ]}
          >
            How you break your fast is as important as the fast itself. Your digestive system has been resting, so reintroduce foods gently to avoid discomfort.
          </InfoCard>

          <RefeedTimeline />
        </div>
      </div>

      {/* Navigation Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[100px] w-full pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundColor: '#0A0E15',
            clipPath: 'ellipse(130% 100% at 50% 100%)',
          }}
        />
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 h-[90px] flex justify-center items-center"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        <style>
          {`
            @keyframes activeRipple {
              0% { 
                transform: scale(1); 
                opacity: 0.2; 
              }
              100% { 
                transform: scale(2); 
                opacity: 0; 
              }
            }
            
            .active-ripple {
              animation: activeRipple 2s ease-out infinite;
            }
          `}
        </style>
        
        <div className="flex items-center justify-around w-full max-w-lg px-4">
          
          <button 
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-white/10 opacity-70 hover:opacity-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#F8FAFB"/>
              <circle cx="12" cy="12" r="8" stroke="#F8FAFB" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>

          <button 
            onClick={() => navigate(createPageUrl("Breathe"))}
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-white/10 opacity-70 hover:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3c-2 2-2 4 0 6 2-2 2-4 0-6z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M20.5 7.5c-2.8 0.8-4.2 2.8-3.5 5.5 2.8-0.8 4.2-2.8 3.5-5.5z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M20.5 16.5c-0.8-2.8-2.8-4.2-5.5-3.5 0.8 2.8 2.8 4.2 5.5 3.5z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M12 21c2-2 2-4 0-6-2 2-2 4 0 6z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M3.5 16.5c2.8-0.8 4.2-2.8 3.5-5.5-2.8 0.8-4.2 2.8-3.5 5.5z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <path d="M3.5 7.5c0.8 2.8 2.8 4.2 5.5 3.5-0.8-2.8-2.8-4.2-5.5-3.5z" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
              <circle cx="12" cy="12" r="2" stroke="#F8FAFB" strokeWidth="1.2" fill="none"/>
            </svg>
          </button>

          <button 
            onClick={() => navigate(createPageUrl("ActiveTimer"))}
            className="flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 relative hover:bg-white/10 opacity-70 hover:opacity-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#F8FAFB" strokeWidth="1.5"/>
              <polyline points="12,6 12,12 16,14" stroke="#F8FAFB" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          <button 
            onClick={() => navigate(createPageUrl("Nutrition"))}
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 relative"
            style={{
              background: 'linear-gradient(135deg, #7FB3D3, #4A90A4)',
              filter: 'drop-shadow(0 0 8px rgba(127, 179, 211, 0.4))'
            }}
          >
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full border border-[#7FB3D3] active-ripple" style={{ opacity: 0.2 }}></div>
            <div className="absolute inset-0 rounded-full border border-[#7FB3D3] active-ripple" style={{ opacity: 0.2, animationDelay: '1s' }}></div>
            
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 2v7c0 6 4 10 9 10s9-4 9-10V2h-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 2v20" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button 
            onClick={() => navigate(createPageUrl("Profile"))}
            className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:bg-white/10 opacity-70 hover:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#F8FAFB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="#F8FAFB" strokeWidth="1.2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
