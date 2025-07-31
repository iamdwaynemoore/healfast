
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MoreHorizontal,
  Trash2
} from "lucide-react";
import { format, differenceInHours, isToday, isYesterday, isThisWeek } from "date-fns";
import { FastingSession } from "@/api/entities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RecentFasts({ fasts, onUpdate }) {
  const handleDeleteFast = async (fastId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fasting session? This action cannot be undone."
    );
    
    if (confirmDelete) {
      try {
        await FastingSession.delete(fastId);
        onUpdate();
      } catch (error) {
        console.error('Error deleting fast:', error);
        alert('Failed to delete fasting session. Please try again.');
      }
    }
  };

  const getTypeLabel = (type, protocol) => {
    if (type === 'intermittent' && protocol) return `${protocol} Fast`;
    return `${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} Fast`;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "#4A90A4",
      stopped: "#6B7280",
      paused: "#F59E0B"
    };
    return colors[status] || "#6B7280";
  };

  const getRelativeDateString = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isThisWeek(date)) return "This Week";
    return format(date, 'MMM d');
  };

  const formatDuration = (hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  };

  // First, sort all fasts by start_time descending to get the most recent ones
  const sortedAllFasts = [...fasts].sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  // Take only the top 3 most recent fasts to display on the dashboard
  const limitedFasts = sortedAllFasts.slice(0, 3);

  // Group the limited fasts by date
  const groupedFasts = limitedFasts.reduce((groups, fast) => {
    const fastDate = new Date(fast.start_time);
    const dateKey = getRelativeDateString(fastDate);
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(fast);
    return groups;
  }, {});

  // Sort groups by date (today first, then yesterday, etc.)
  const sortedGroups = Object.entries(groupedFasts).sort(([a], [b]) => {
    const order = ['Today', 'Yesterday', 'This Week'];
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return b.localeCompare(a); // For specific dates not in order, sort descending
  });

  if (!fasts || fasts.length === 0) {
    return (
      <Card className="glass-morphism border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200 font-medium">
            <Clock className="w-5 h-5 text-primary" />
            Recent Fasts
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-slate-400">No completed fasts yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-200 font-medium">
          <Clock className="w-5 h-5 text-primary" />
          Recent Fasts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedGroups.map(([dateGroup, groupFasts]) => (
          <div key={dateGroup} className="space-y-3">
            {/* Date Separator */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {dateGroup}
              </span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>
            
            {/* Fasts for this date - groupFasts will now only contain up to 3 total fasts across all groups */}
            <div className="space-y-2">
              {groupFasts.map((fast) => { // Removed .slice(0, 3) as overall limit is applied earlier
                const actualDuration = fast.actual_end_time 
                  ? differenceInHours(new Date(fast.actual_end_time), new Date(fast.start_time))
                  : 0;

                return (
                  <div 
                    key={fast.id} 
                    className="flex items-center gap-3 py-2 hover:bg-slate-800/20 rounded-lg px-3 -mx-3 transition-colors"
                  >
                    {/* Status Indicator */}
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getStatusColor(fast.status) }}
                    ></div>
                    
                    {/* Fast Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-200 mb-1">
                        {getTypeLabel(fast.type, fast.protocol)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>{formatDuration(actualDuration)}</span>
                        <span>•</span>
                        <span className="capitalize">{fast.status}</span>
                      </div>
                    </div>

                    {/* Menu Button */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem 
                          onClick={() => handleDeleteFast(fast.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Fast
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Show total count if there are more fasts than displayed */}
        {fasts.length > 3 && ( // Changed condition to reflect global display limit of 3
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Showing recent fasts • {fasts.length} total
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
