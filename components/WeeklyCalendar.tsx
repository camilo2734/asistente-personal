import React from 'react';
import { WEEKLY_SCHEDULE } from '../constants';
import { ClassSession } from '../types';

const WeeklyCalendar: React.FC = () => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
  const hours = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM to 7 PM

  const getClassesForSlot = (dayIndex: number, hour: number) => {
    // Map visual index (0=Mon) to constants index (1=Mon)
    const constantDayIndex = dayIndex + 1;
    
    return WEEKLY_SCHEDULE.filter(c => {
      const startH = parseInt(c.startTime.split(':')[0]);
      return c.dayOfWeek === constantDayIndex && hour === startH;
    });
  };

  const getDurationHeight = (cls: ClassSession) => {
    const start = parseInt(cls.startTime.split(':')[0]);
    const end = parseInt(cls.endTime.split(':')[0]);
    const duration = end - start;
    // 1 hour = 3.5rem (56px) approx based on grid, but let's use explicit sizing
    // h-14 is 3.5rem. 
    if (duration === 2) return 'h-28'; // 7rem
    if (duration === 3) return 'h-42'; // 10.5rem
    return 'h-14';
  };

  const getSubjectStyle = (subject: string) => {
    if (subject.includes('Simulación')) return 'bg-blue-100/80 text-blue-700 border-l-4 border-blue-500';
    if (subject.includes('Operaciones')) return 'bg-indigo-100/80 text-indigo-700 border-l-4 border-indigo-500';
    if (subject.includes('Emprendedoras')) return 'bg-emerald-100/80 text-emerald-700 border-l-4 border-emerald-500';
    if (subject.includes('Calidad')) return 'bg-purple-100/80 text-purple-700 border-l-4 border-purple-500';
    if (subject.includes('Estadísticos')) return 'bg-rose-100/80 text-rose-700 border-l-4 border-rose-500';
    return 'bg-slate-100 text-slate-700 border-l-4 border-slate-400';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr] gap-2 mb-4 sticky top-0 bg-white/95 backdrop-blur z-10 py-2 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-300 text-center pt-2">GMT-5</div>
                {days.map(day => (
                    <div key={day} className="text-center">
                        <div className="text-xs font-bold text-slate-800 uppercase tracking-widest">{day}</div>
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr] gap-x-2 gap-y-0 relative">
                
                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        {/* Time Label */}
                        <div className="text-[11px] font-medium text-slate-400 text-right pr-3 -mt-2 relative h-14">
                            {hour}:00
                        </div>

                        {/* Columns */}
                        {days.map((_, dayIdx) => {
                            const classes = getClassesForSlot(dayIdx, hour);
                            return (
                                <div key={`${dayIdx}-${hour}`} className="h-14 border-t border-slate-100 border-dashed relative group hover:bg-slate-50 transition-colors">
                                    {classes.map(cls => (
                                        <div 
                                            key={cls.id}
                                            className={`absolute inset-x-0 top-0 m-1 rounded-r-lg p-2 text-xs shadow-sm cursor-pointer hover:brightness-95 hover:scale-[1.02] transition-all z-10 ${getSubjectStyle(cls.subject)} ${getDurationHeight(cls)}`}
                                        >
                                            <div className="font-bold line-clamp-2 leading-tight">{cls.subject}</div>
                                            <div className="opacity-80 text-[10px] mt-1 font-medium">{cls.startTime} - {cls.endTime}</div>
                                            {cls.room && <div className="absolute bottom-1 right-2 text-[9px] opacity-70 bg-white/30 px-1 rounded">Salón {cls.room}</div>}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;