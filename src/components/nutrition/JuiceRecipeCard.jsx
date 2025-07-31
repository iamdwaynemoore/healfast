import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets } from 'lucide-react';

export default function JuiceRecipeCard({ title, description, ingredients, instructions, color }) {
  const colorClasses = {
    green: {
      gradient: 'from-green-500 to-emerald-500',
      text: 'text-green-400',
    },
    red: {
      gradient: 'from-red-500 to-pink-500',
      text: 'text-red-400',
    }
  };

  const selectedColor = colorClasses[color] || colorClasses.green;

  return (
    <div className={`p-1 rounded-xl bg-gradient-to-br ${selectedColor.gradient}`}>
      <Card className="bg-slate-900 border-0 h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Droplets className={`w-6 h-6 ${selectedColor.text}`} />
            <div>
              <CardTitle className="text-slate-200 font-medium">{title}</CardTitle>
              <p className="text-slate-400 text-sm">{description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-slate-300">Ingredients:</h4>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((item, index) => (
                <Badge key={index} variant="outline" className="text-slate-300 border-slate-600">{item}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-slate-300">Instructions:</h4>
            <ol className="list-decimal list-inside text-slate-400 space-y-1">
              {instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}