
import React from 'react';
import { Trophy, CheckCircle2, Users, Heart, Star, TrendingUp, CalendarCheck, BookOpen, ArrowRight, AlertCircle } from 'lucide-react';
import { HistoryItem } from '../types';

interface WeeklySummaryPanelProps {
  history: HistoryItem[];
}

const WeeklySummaryPanel: React.FC<WeeklySummaryPanelProps> = ({ history }) => {
  // Filter history for the last 7 days
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentHistory = history.filter(item => new Date(item.completedAt) > oneWeekAgo);

  // Calculate Stats
  const academicCompleted = recentHistory.filter(i => i.category === 'ACADEMIC').length;
  const mentoringSessions = recentHistory.filter(i => i.category === 'MENTORING').length;
  const personalTasks = recentHistory.filter(i => i.category === 'PERSONAL').length;
  
  // Simple "effectiveness" mock calculation based on activity (capped at 100)
  const totalActivity = academicCompleted + mentoringSessions + personalTasks;
  const effectiveness = totalActivity === 0 ? 0 : Math.min(100, 50 + (totalActivity * 5));

  const getIconForCategory = (cat: string) => {
      switch(cat) {
          case 'ACADEMIC': return BookOpen;
          case 'MENTORING': return Users;
          case 'PERSONAL': return Heart;
          default: return Star;
      }
  };

  const getStyleForCategory = (cat: string) => {
      switch(cat) {
          case 'ACADEMIC': return { color: 'text-indigo-600', bg: 'bg-indigo-50' };
          case 'MENTORING': return { color: 'text-orange-600', bg: 'bg-orange-50' };
          case 'PERSONAL': return { color: 'text-rose-600', bg: 'bg-rose-50' };
          default: return { color: 'text-slate-600', bg: 'bg-slate-50' };
      }
  };

  const formatDate = (iso: string) => {
      return new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-violet-200 via-indigo-200 to-blue-200 shadow-xl shadow-indigo-100/50 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/80 backdrop-blur-xl rounded-[23px] p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl text-white shadow-lg shadow-violet-200">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-none">Resumen Semana Pasada</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                 Actividad reciente basada en tu historial real
              </p>
            </div>
          </div>
          {totalActivity > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
                <TrendingUp className="w-4 h-4" />
                <span>Registro activo</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: KPI Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Academic Stat */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-400">ACADÉMICO</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{academicCompleted}</div>
              <div className="text-xs text-slate-500">Tareas completadas</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, academicCompleted * 10)}%` }}></div>
              </div>
            </div>

            {/* Mentoring Stat */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:shadow-md transition-shadow group">
               <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-400">MONITORÍA</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{mentoringSessions}</div>
              <div className="text-xs text-slate-500">Temas finalizados</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, mentoringSessions * 20)}%` }}></div>
              </div>
            </div>

            {/* Personal Stat */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:shadow-md transition-shadow group">
               <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600 group-hover:scale-110 transition-transform">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-400">PERSONAL</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{personalTasks}</div>
              <div className="text-xs text-slate-500">Actividades listas</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, personalTasks * 10)}%` }}></div>
              </div>
            </div>

             {/* Efficiency Stat */}
             <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:shadow-md transition-shadow group">
               <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-400">EFECTIVIDAD</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{effectiveness}%</div>
              <div className="text-xs text-slate-500">Nivel de actividad</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${effectiveness}%` }}></div>
              </div>
            </div>
          </div>

          {/* Right Column: Highlights List */}
          <div className="bg-slate-50/50 rounded-2xl p-1 border border-slate-100 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Últimos Logros</h3>
            </div>
            <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[220px] scrollbar-hide">
              {recentHistory.length > 0 ? (
                recentHistory.slice(0, 8).map((item) => {
                    const Icon = getIconForCategory(item.category);
                    const style = getStyleForCategory(item.category);
                    return (
                    <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className={`p-2 rounded-full shrink-0 ${style.bg} ${style.color}`}>
                        <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-800 truncate">{item.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                             <span className="capitalize">{formatDate(item.completedAt)}</span>
                             {item.details && <span className="text-slate-300">•</span>}
                             {item.details && <span className="truncate max-w-[100px]">{item.details}</span>}
                        </div>
                        </div>
                        <div className="text-slate-300">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                    );
                })
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                      <AlertCircle className="w-8 h-8 opacity-20 mb-2" />
                      <p className="text-sm font-medium">No se registraron nuevas actividades esta semana.</p>
                      <p className="text-xs opacity-70 mt-1">Completa tareas para verlas aquí.</p>
                  </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WeeklySummaryPanel;
