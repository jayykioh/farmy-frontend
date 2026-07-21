import React from 'react';
import type { Reminder } from '../api/reminders';
import { CheckCircle, Clock, Drop, Flask, Bug, Plant, NotePencil, ChartBar, Trophy, Warning } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { motion } from 'framer-motion';

interface ReminderCardProps {
  reminder: Reminder;
  onDone?: () => void;
  onSnooze?: () => void;
}

const activityConfig: Record<string, { icon: React.ReactNode; bg: string; iconBg: string; accent: string }> = {
  water:            { icon: <Drop size={20} weight="duotone" />,        bg: 'bg-[#EDF8FF]',  iconBg: 'bg-[#C6EEFF] text-[#0284C7]', accent: 'text-[#0284C7]' },
  fertilize:        { icon: <Flask size={20} weight="duotone" />,       bg: 'bg-[#F5F3FF]',  iconBg: 'bg-[#EDE9FE] text-[#7C3AED]', accent: 'text-[#7C3AED]' },
  pesticide:        { icon: <Bug size={20} weight="duotone" />,         bg: 'bg-[#FFF7ED]',  iconBg: 'bg-[#FED7AA] text-[#C2410C]', accent: 'text-[#C2410C]' },
  harvest:          { icon: <Plant size={20} weight="duotone" />,       bg: 'bg-[#F0FDF4]',  iconBg: 'bg-[#BBF7D0] text-[#15803D]', accent: 'text-[#15803D]' },
  diary:            { icon: <NotePencil size={20} weight="duotone" />,  bg: 'bg-[#FFFBEB]',  iconBg: 'bg-[#FDE68A] text-[#B45309]', accent: 'text-[#B45309]' },
  plant_alert:      { icon: <Warning size={20} weight="duotone" />,     bg: 'bg-[#FFF1F2]',  iconBg: 'bg-[#FFE4E6] text-[#BE123C]', accent: 'text-[#BE123C]' },
  streak_milestone: { icon: <Trophy size={20} weight="duotone" />,      bg: 'bg-[#FFFBEB]',  iconBg: 'bg-[#FDE68A] text-[#B45309]', accent: 'text-[#B45309]' },
  weekly_insight:   { icon: <ChartBar size={20} weight="duotone" />,    bg: 'bg-[#F0F9FF]',  iconBg: 'bg-[#BAE6FD] text-[#0369A1]', accent: 'text-[#0369A1]' },
  other:            { icon: <NotePencil size={20} weight="duotone" />,  bg: 'bg-[var(--color-paper-2)]', iconBg: 'bg-[var(--color-paper-3)] text-[var(--color-ink-2)]', accent: 'text-[var(--color-ink-2)]' },
};

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onDone, onSnooze }) => {
  const remindAtDate = new Date(reminder.remind_at);
  const isPast = remindAtDate < new Date() && reminder.status !== 'completed';
  const isCompleted = reminder.status === 'completed';

  const config = activityConfig[reminder.type || 'other'] ?? activityConfig['other'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: isCompleted ? 0.55 : 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 320 }}
      className={`relative overflow-hidden rounded-[20px] border transition-all select-none ${
        isPast
          ? 'bg-[#FFF1F2] border-red-200 shadow-[0_4px_20px_rgba(239,68,68,0.10)]'
          : isCompleted
          ? 'bg-[var(--color-paper-2)] border-[var(--color-border-main)]'
          : `${config.bg} border-[var(--color-border-main)] shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] hover:-translate-y-[1px]`
      }`}
    >
      {/* Accent left bar */}
      {!isCompleted && (
        <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${isPast ? 'bg-red-400' : config.iconBg.split(' ')[1]}`} />
      )}

      <div className="flex items-center gap-3 px-4 py-3.5 pl-5">
        {/* Icon badge */}
        <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${isPast ? 'bg-red-100 text-red-500' : config.iconBg}`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-[14px] leading-snug tracking-tight ${
            isCompleted
              ? 'line-through text-[var(--color-ink-3)]'
              : 'text-[var(--color-ink)]'
          }`}>
            {reminder.title}
          </p>

          {reminder.diary && (
            <p
              className="mt-1 truncate text-[12px] font-bold text-[#007A54]"
              title={[reminder.diary.crop_type, reminder.diary.season].filter(Boolean).join(' · ')}
            >
              Mùa vụ: {[reminder.diary.crop_type, reminder.diary.season].filter(Boolean).join(' · ')}
            </p>
          )}

          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[12px] font-semibold flex items-center gap-1 ${isPast ? 'text-red-500' : 'text-[var(--color-ink-2)]'}`}>
              <Clock size={12} weight="bold" />
              {format(remindAtDate, 'HH:mm', { locale: vi })}
            </span>
            {isPast && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-red-500 text-white px-2 py-0.5 rounded-full">
                Quá hạn
              </span>
            )}
          </div>
        </div>

        {/* Done button inline */}
        {!isCompleted && onDone && (
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onDone}
            className="w-9 h-9 rounded-full bg-[#008A5E]/10 text-[#008A5E] flex items-center justify-center shrink-0 hover:bg-[#008A5E]/20 transition-colors cursor-pointer"
            title="Đánh dấu hoàn thành"
          >
            <CheckCircle size={20} weight="duotone" />
          </motion.button>
        )}
      </div>

      {/* Snooze row (only if provided separately) */}
      {!isCompleted && onSnooze && (
        <div className="px-5 pb-3 -mt-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onSnooze}
            className="w-full py-1.5 text-[12px] font-bold text-[var(--color-ink-2)] bg-white/60 rounded-full border border-[var(--color-border-main)] hover:bg-white transition-colors cursor-pointer"
          >
            Hoãn lại
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
