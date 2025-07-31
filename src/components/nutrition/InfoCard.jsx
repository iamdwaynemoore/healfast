import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

export default function InfoCard({ title, icon: Icon, focusItems, avoidItems, children }) {
  return (
    <Card className="glass-morphism border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-slate-200 font-medium">
          <Icon className="w-6 h-6 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-slate-300">
        {children && <div className="text-slate-400">{children}</div>}
        {focusItems && (
          <div>
            <h4 className="font-semibold mb-2 text-green-400">Focus On:</h4>
            <ul className="space-y-2">
              {focusItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {avoidItems && (
          <div>
            <h4 className="font-semibold mb-2 text-red-400">Reduce or Avoid:</h4>
            <ul className="space-y-2">
              {avoidItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}