import React from 'react';
import type { Reminder } from '../api/reminders';
import { Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { motion } from 'framer-motion';

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
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-[24px] ring-1 transition-all ${
        isPast 
          ? 'bg-[#FFF9F9] ring-red-500/10 shadow-[0_8px_30px_rgba(239,68,68,0.08)]' 
          : reminder.status === 'completed' 
            ? 'bg-slate-50 ring-black/[0.02] opacity-60 shadow-none' 
            : 'bg-white ring-black/[0.03] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-[15px] leading-tight text-slate-800 tracking-tight mb-1 ${reminder.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
            {reminder.title}
          </h4>
          
          <div className="flex items-center flex-wrap gap-2 mt-0.5">
            <p className={`text-[13px] flex items-center gap-1 ${isPast ? 'text-red-500 font-bold' : 'text-slate-500 font-medium'}`}>
              <Clock className="w-3.5 h-3.5" />
              {format(remindAtDate, 'HH:mm', { locale: vi })}
              {isPast && <span className="ml-1 text-[10px] font-black uppercase tracking-wider bg-red-100 px-1.5 py-0.5 rounded-md text-red-600">Quá hạn</span>}
            </p>
          </div>
        </div>
      </div>
      
      {reminder.status !== 'completed' && (onDone || onSnooze) && (
        <div className="flex gap-2.5 mt-4 pl-[44px]">
          {onDone && (
            <motion.button 
              whileTap={{ scale: 0.93 }}
              onClick={onDone} 
              className="flex-1 py-2 px-3 bg-[#E8F8F5] text-[#00A97F] rounded-full text-[13.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" /> Đã xong
            </motion.button>
          )}
          {onSnooze && (
            <motion.button 
              whileTap={{ scale: 0.93 }}
              onClick={onSnooze} 
              className="flex-[0.7] py-2 px-3 bg-slate-100 text-slate-600 rounded-full text-[13.5px] font-bold transition-colors cursor-pointer"
            >
              Hoãn
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};
