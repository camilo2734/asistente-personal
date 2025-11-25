import React, { useState } from 'react';
import { Home, Heart, ShoppingBag, Wallet, CheckCircle2, Plus, X, Tag, MoreHorizontal, Calendar, Activity, Utensils } from 'lucide-react';

type Category = 'Hogar' | 'Salud' | 'Finanzas' | 'Compras' | 'Otros';
type Priority = 'Alta' | 'Media' | 'Baja';

interface PersonalTask {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  date?: string;
}

const PersonalTasksPanel: React.FC = () => {
  const [tasks, setTasks] = useState<PersonalTask[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Hogar');
  const [newPriority, setNewPriority] = useState<Priority>('Media');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    setTasks([
      {
        id: Date.now().toString(),
        title: newTitle,
        category: newCategory,
        priority: newPriority,
        completed: false,
        date: 'Hoy' // Default for quick add
      },
      ...tasks
    ]);
    
    setNewTitle('');
    setIsAdding(false);
  };

  // Función modificada: Elimina la tarea en lugar de marcarla como completada
  const completeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const categories: Record<Category, { icon: any, color: string, bg: string }> = {
    'Hogar': { icon: Home, color: 'text-orange-600', bg: 'bg-orange-100' },
    'Salud': { icon: Activity, color: 'text-rose-600', bg: 'bg-rose-100' },
    'Finanzas': { icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    'Compras': { icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    'Otros': { icon: Tag, color: 'text-slate-600', bg: 'bg-slate-100' },
  };

  const priorityColors = {
    'Alta': 'bg-rose-500',
    'Media': 'bg-amber-400',
    'Baja': 'bg-slate-300'
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-rose-100/50 border border-slate-100 relative overflow-hidden group mt-6">
       
        {/* Decorative Background */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-50 rounded-full -ml-20 -mb-20 opacity-60 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
                <div className="bg-rose-100 p-2 rounded-xl text-rose-600 shadow-sm shadow-rose-100">
                    <Heart className="w-5 h-5" fill="currentColor" fillOpacity={0.2} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 leading-tight">Vida Personal</h3>
                    <p className="text-xs text-slate-400 font-medium">
                        {tasks.length} activas
                    </p>
                </div>
            </div>
            <button
                onClick={() => setIsAdding(!isAdding)}
                className={`p-2 rounded-full transition-all duration-300 ${isAdding ? 'bg-slate-100 text-slate-600 rotate-45' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        {/* Add Form */}
        {isAdding && (
            <form onSubmit={handleAdd} className="mb-6 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                <input
                    autoFocus
                    type="text"
                    placeholder="¿Qué necesitas hacer?"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 mb-3"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                
                <div className="flex justify-between items-center gap-2">
                    {/* Category Selector */}
                    <div className="flex gap-1">
                        {Object.entries(categories).map(([key, config]) => {
                            const Icon = config.icon;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setNewCategory(key as Category)}
                                    className={`p-1.5 rounded-lg transition-all ${newCategory === key ? config.bg + ' ' + config.color + ' ring-2 ring-offset-1 ring-slate-100' : 'text-slate-400 hover:bg-white'}`}
                                    title={key}
                                >
                                    <Icon className="w-4 h-4" />
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Priority Selector */}
                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
                         {(['Baja', 'Media', 'Alta'] as Priority[]).map(p => (
                             <button
                                key={p}
                                type="button"
                                onClick={() => setNewPriority(p)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${newPriority === p ? priorityColors[p] + ' scale-125' : 'bg-slate-200 hover:bg-slate-300'}`}
                                title={`Prioridad ${p}`}
                             />
                         ))}
                    </div>

                    <button type="submit" className="bg-rose-500 text-white p-2 rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 ml-auto">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </form>
        )}

        {/* Tasks List */}
        <div className="space-y-2 relative z-10 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {tasks.map(task => {
                const CatIcon = categories[task.category].icon;
                const catStyle = categories[task.category];

                return (
                    <div 
                        key={task.id} 
                        className={`group flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 border ${task.completed ? 'bg-slate-50/50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-rose-100 hover:shadow-sm'}`}
                    >
                         <button 
                            onClick={() => completeTask(task.id)}
                            className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-slate-400 border-slate-400 text-white' : 'border-slate-300 text-transparent hover:border-rose-400 hover:bg-rose-50'}`}
                            title="Completar y eliminar"
                        >
                            <CheckCircle2 className="w-3 h-3" />
                        </button>

                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start">
                                 <span className={`text-sm font-medium leading-tight ${task.completed ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                     {task.title}
                                 </span>
                                 {!task.completed && (
                                     <div className={`shrink-0 w-1.5 h-1.5 rounded-full ${priorityColors[task.priority]} mt-1.5`} title={`Prioridad ${task.priority}`} />
                                 )}
                             </div>
                             
                             <div className="flex items-center gap-2 mt-1.5">
                                 <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${catStyle.bg} ${catStyle.color}`}>
                                     <CatIcon className="w-3 h-3" />
                                     {task.category}
                                 </span>
                                 {task.date && (
                                     <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                         <Calendar className="w-3 h-3" />
                                         {task.date}
                                     </span>
                                 )}
                             </div>
                        </div>
                    </div>
                );
            })}

            {tasks.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                    ¡Todo ordenado! Disfruta tu tiempo libre.
                </div>
            )}
        </div>
    </div>
  );
};

export default PersonalTasksPanel;