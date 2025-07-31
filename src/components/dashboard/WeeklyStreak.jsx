
import React from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

export default function WeeklyStreak({ recentFasts }) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const hasFast = recentFasts.some(fast => 
      isSameDay(new Date(fast.start_time), date) && fast.status === 'completed'
    );
    
    return {
      date,
      dayName: format(date, 'EEE').toUpperCase(),
      hasFast,
      isToday: isSameDay(date, today)
    };
  });

  return (
    <div className="px-6 mb-8">
      <div className="flex justify-between items-center">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <span className="text-xs text-foreground/70 font-medium">
              {day.dayName}
            </span>
            <div 
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                day.hasFast 
                  ? 'bg-accent border-accent' 
                  : day.isToday
                    ? 'border-primary bg-card'
                    : 'border-border bg-transparent'
              }`}
            >
              {day.hasFast && (
                <div className="w-2 h-2 bg-background rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
