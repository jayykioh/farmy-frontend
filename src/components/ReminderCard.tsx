import React from 'react';
import type { Reminder } from '../api/reminders';
import { Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale/vi';

interface ReminderCardProps {
  reminder: Reminder;
  onDone?: () => void;
  onSnooze?: () => void;
}

const activityIcons: Record<string, string> = {
  water: '💧', 
  fertilize: '🧪', 
  pesticide: '🐛', 
  harvest: '🌾', 
  diary: '📝',
  other: '📋',
  plant_alert: '⚠️',
  streak_milestone: '🏆',
  weekly_insight: '📊'
};

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onDone, onSnooze }) => {
  const remindAtDate = new Date(reminder.remind_at);
  const isPast = remindAtDate < new Date() && reminder.status !== 'completed';
  
  const icon = activityIcons[reminder.type || 'other'] || activityIcons['other'];
  
  return (
    <div className={`p-3 rounded-xl border transition-all ${isPast ? 'bg-red-50/50 border-red-200 shadow-[0_2px_8px_rgba(239,68,68,0.1)]' : reminder.status === 'completed' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-border-main/50 shadow-sm hover:shadow-md'}`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl mt-1">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-text-h truncate ${reminder.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {reminder.title}
          </h4>
          
          <div className="flex items-center flex-wrap gap-2 mt-1">
            <p className={`text-xs flex items-center gap-1 ${isPast ? 'text-red-500 font-medium' : 'text-text-main/60'}`}>
              <Clock className="w-3.5 h-3.5" />
              {format(remindAtDate, 'HH:mm', { locale: vi })}
              {isPast && <span className="ml-1 text-[10px] bg-red-100 px-1.5 py-0.5 rounded text-red-600">Quá hạn</span>}
            </p>
          </div>
        </div>
      </div>
      
      {reminder.status !== 'completed' && (onDone || onSnooze) && (
        <div className="flex gap-2 mt-3 pl-9">
          {onDone && (
            <button 
              onClick={onDone} 
              className="flex-1 py-1.5 px-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" /> Đã xong
            </button>
          )}
          {onSnooze && (
            <button 
              onClick={onSnooze} 
              className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-text-main rounded-lg text-sm font-medium transition-colors"
            >
              Hoãn
            </button>
          )}
        </div>
      )}
    </div>
  );
};
