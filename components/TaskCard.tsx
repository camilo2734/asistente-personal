import React from 'react';
import { Task, Priority, TaskType } from '../types';
import { Check, Clock, Tag, BookOpen, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
  // Color configuration
  const priorityConfig = {
    [Priority.HIGH]: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', dot: 'bg-rose-500' },
    [Priority.MEDIUM]: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500' },
    [Priority.LOW]: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  };

  const typeConfig = {
    [TaskType.ACADEMIC]: { label: 'Académico', color: 'text-blue-600', bg: 'bg-blue-50' },
    [TaskType.PERSONAL]: { label: 'Personal', color: 'text-purple-600', bg: 'bg-purple-50' },
    [TaskType.MONITOR]: { label: 'Monitoría', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    [TaskType.OTHER]: { label: 'Otro', color: 'text-slate-500', bg: 'bg-slate-100' },
  };

  const pStyle = priorityConfig[task.priority];
  const tStyle = typeConfig[task.type];

  return (
    <div 
      className={`group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 
      ${task.completed 
        ? 'bg-slate-50 opacity-60' 
        : 'bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 hover:shadow-indigo-100/50 border border-slate-100'
      }`}
    >
      {/* Custom Checkbox */}
      <button 
        onClick={() => onToggle(task.id)}
        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${task.completed 
            ? 'bg-indigo-500 border-indigo-500 text-white' 
            : 'border-slate-300 text-transparent hover:border-indigo-400 hover:bg-indigo-50'
          }`}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </button>
      
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-2">
           <h3 className={`font-semibold text-base leading-snug transition-colors duration-200 ${task.completed ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800 group-hover:text-indigo-900'}`}>
            {task.title}
          </h3>
          
          {/* Priority Dot */}
          {!task.completed && (
            <div className={`shrink-0 w-2 h-2 rounded-full mt-2 ${pStyle.dot}`} title={`Prioridad ${task.priority}`}></div>
          )}
        </div>

        {task.description && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
        )}
        
        {/* Meta Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5">
          
          {/* Subject Badge */}
          {task.subject && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold tracking-wide">
              <BookOpen className="w-3 h-3" />
              {task.subject}
            </span>
          )}

          {/* Type Badge */}
          {!task.subject && (
             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide ${tStyle.bg} ${tStyle.color}`}>
               <Tag className="w-3 h-3" />
               {tStyle.label}
             </span>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
              <Clock className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;