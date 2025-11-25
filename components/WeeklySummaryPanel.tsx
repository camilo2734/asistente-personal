
import React from 'react';
import { Trophy, CheckCircle2, Users, Heart, Star, TrendingUp, CalendarCheck, BookOpen, ArrowRight } from 'lucide-react';

const WeeklySummaryPanel: React.FC = () => {
  // Mock Data para visualizar el diseño
  const stats = {
    academicCompleted: 14,
    mentoringSessions: 2,
    personalTasks: 6,
    effectiveness: 92
  };

  const highlights = [
    {
      id: 1,
      category: 'ACADEMIC',
      title: 'Entrega Final: Simulación',
      date: 'Viernes',
      icon: BookOpen,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      id: 2,
      category: 'MENTORING',
      title: 'Taller de Repaso: Parcial 2',
      date: 'Jueves',
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      id: 3,
      category: 'PERSONAL',
      title: 'Compra mensual y pagos',
      date: 'Sábado',
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
    {
      id: 4,
      category: 'ACADEMIC',
      title: 'Quiz de Operaciones (Nota: 5.0)',
      date: 'Martes',
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    }
  ];

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
              <p className="text-sm text-slate-500 font-medium mt-1">20 Oct - 26 Oct</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
            <TrendingUp className="w-4 h-4" />
            <span>Excelente rendimiento</span>
          </div>
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
              <div className="text-3xl font-bold text-slate-800 mb-1">{stats.academicCompleted}</div>
              <div className="text-xs text-slate-500">Tareas completadas</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full w-[85%]"></div>
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
              <div className="text-3xl font-bold text-slate-800 mb-1">{stats.mentoringSessions}</div>
              <div className="text-xs text-slate-500">Sesiones dictadas</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full w-[100%]"></div>
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
              <div className="text-3xl font-bold text-slate-800 mb-1">{stats.personalTasks}</div>
              <div className="text-xs text-slate-500">Actividades listas</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full w-[60%]"></div>
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
              <div className="text-3xl font-bold text-slate-800 mb-1">{stats.effectiveness}%</div>
              <div className="text-xs text-slate-500">Cumplimiento total</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[92%]"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Highlights List */}
          <div className="bg-slate-50/50 rounded-2xl p-1 border border-slate-100 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Highlights de la Semana</h3>
            </div>
            <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[220px] scrollbar-hide">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className={`p-2 rounded-full shrink-0 ${item.bg} ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                    <div className="text-slate-300">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WeeklySummaryPanel;
