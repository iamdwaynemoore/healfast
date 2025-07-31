import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TimelineStep = ({ time, title, description, foods }) => (
  <div className="relative pl-8">
    <div className="absolute left-0 top-1 w-4 h-4 bg-primary rounded-full border-4 border-slate-950"></div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-primary">{time}</p>
      <h4 className="font-medium text-slate-200 mt-1">{title}</h4>
      <p className="text-sm text-slate-400 mt-1">{description}</p>
      <div className="mt-2 text-xs text-slate-300 list-disc list-inside">
        {foods.map((food, index) => (
          <li key={index}>{food}</li>
        ))}
      </div>
    </div>
  </div>
);

export default function RefeedTimeline() {
  const steps = [
    {
      time: 'First 1-2 Hours',
      title: 'Gentle Hydration',
      description: 'Focus on liquids to gently reawaken your digestive system.',
      foods: ['Water with lemon', 'Diluted bone broth', 'Herbal tea (peppermint, ginger)'],
    },
    {
      time: 'Hours 2-6',
      title: 'Light & Simple',
      description: 'Introduce very light, easily digestible foods. Small portions are key.',
      foods: ['Watermelon or cantaloupe', 'A few spoonfuls of plain yogurt or kefir', 'Steamed spinach or asparagus'],
    },
    {
      time: 'Day 1',
      title: 'Soft & Cooked',
      description: 'Stick to soft, cooked, and low-fiber foods for the first 24 hours.',
      foods: ['Scrambled eggs', 'Avocado', 'Steamed non-starchy vegetables', 'Small piece of cooked fish'],
    },
    {
      time: 'Day 2 & Beyond',
      title: 'Gradual Reintroduction',
      description: 'Slowly expand your diet, paying close attention to how your body feels.',
      foods: ['Introduce healthy fats like nuts/seeds', 'Add complex carbs like sweet potato', 'Listen to your body and introduce other foods slowly'],
    },
  ];

  return (
    <Card className="glass-morphism border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-200 font-medium">Refeeding Timeline: A Gentle Return</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-slate-700 space-y-8">
          {steps.map((step, index) => (
            <TimelineStep key={index} {...step} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}