import React from 'react';
import { SmartSuggestion } from '../types';
import { Sparkles, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

interface SummaryWidgetProps {
  suggestion: SmartSuggestion | null;
  taskCount: number;
  classesToday: number;
}

const SummaryWidget: React.FC<SummaryWidgetProps> = ({ suggestion, taskCount, classesToday }) => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-2xl shadow-indigo-200 text-white p-1">
      
      {/* Glass Internal Container */}
      <div className="relative bg-white/10 backdrop-blur-[2px] rounded-[1.8rem] p-6 sm:p-8 h-full">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-purple-500/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/10 text-xs font-bold uppercase tracking-wider text-indigo-50 mb-2">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                Resumen Semanal
             </div>
             <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Hola, Camilo
            </h2>
            <p className="text-indigo-100 text-lg font-medium opacity-90 max-w-md leading-relaxed">
              {suggestion ? suggestion.text : "Analizando tu calendario académico para optimizar tu día..."}
            </p>
          </div>

          <div className="flex gap-4">
             {/* Stat Card 1 */}
            <div className="flex-1 min-w-[140px] bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-md hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-2 text-indigo-100 mb-2 text-xs font-bold uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                Pendientes
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{taskCount}</span>
                <span className="text-sm opacity-70">tareas</span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="flex-1 min-w-[140px] bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-md hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-2 text-indigo-100 mb-2 text-xs font-bold uppercase">
                <Calendar className="w-3.5 h-3.5" />
                Clases Hoy
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{classesToday}</span>
                <span className="text-sm opacity-70">sesiones</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SummaryWidget;