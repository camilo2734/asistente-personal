import React, { useState } from 'react';
import { Users, Plus, ChevronRight, Clock, BookOpen, FlaskConical } from 'lucide-react';
import { MentoringTopic } from '../types';

interface MentoringPanelProps {
  topics: MentoringTopic[];
  onAdd: (title: string) => void;
  onCycleStatus: (id: string) => void;
}

const MentoringPanel: React.FC<MentoringPanelProps> = ({ topics, onAdd, onCycleStatus }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAdd(newTitle);
    setNewTitle('');
    setIsAdding(false);
  };

  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'PREPARED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'COMPLETED': return 'bg-slate-100 text-slate-500 border-slate-200 line-through decoration-slate-400';
      default: return 'bg-slate-100';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
        case 'PREPARED': return 'LISTO';
        case 'IN_PROGRESS': return 'EN CURSO';
        case 'COMPLETED': return 'FINALIZADO';
        default: return '';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-60 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-xl text-orange-600 shadow-sm shadow-orange-100">
                    <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 leading-tight">Monitoría Estadística</h3>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3"/> Jueves 14:00 - 16:00
                    </p>
                </div>
            </div>
            <button
                onClick={() => setIsAdding(!isAdding)}
                className={`p-2 rounded-full transition-all duration-300 ${isAdding ? 'bg-slate-100 text-slate-600 rotate-45' : 'hover:bg-slate-50 text-slate-400 hover:text-orange-500'}`}
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        {/* Add Form */}
        {isAdding && (
            <form onSubmit={handleAddSubmit} className="mb-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-2">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Tema a preparar..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button type="submit" className="bg-orange-500 text-white px-3 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </form>
        )}

        {/* List */}
        <div className="space-y-3 relative z-10 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {topics.map(topic => (
                <div key={topic.id} className="group/item bg-slate-50 hover:bg-white border border-slate-100 hover:border-orange-100 rounded-2xl p-3 transition-all hover:shadow-md cursor-pointer select-none">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-1" onClick={() => onCycleStatus(topic.id)}>
                             <div className="flex items-center gap-2 mb-1.5">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getStatusStyle(topic.status)}`}>
                                    {getStatusLabel(topic.status)}
                                </span>
                             </div>
                             <h4 className={`text-sm font-semibold transition-colors leading-snug ${topic.status === 'COMPLETED' ? 'text-slate-400' : 'text-slate-700 group-hover/item:text-orange-900'}`}>
                                {topic.title}
                             </h4>
                             
                             {topic.students && (
                                 <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 group-hover/item:text-slate-500">
                                     <Users className="w-3 h-3" />
                                     <span>{topic.students}</span>
                                 </div>
                             )}
                        </div>
                        {topic.notes && (
                            <div className="text-slate-300 hover:text-orange-400 transition-colors pt-1" title={topic.notes}>
                                <BookOpen className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                </div>
            ))}
            
            {topics.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                    No hay temas de monitoría asignados.
                </div>
            )}
        </div>
    </div>
  );
};

export default MentoringPanel;