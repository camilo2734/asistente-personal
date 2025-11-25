
import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, BrainCircuit, Book, MessageSquare, Plus, LayoutGrid, Zap, GraduationCap, ListFilter, XCircle } from 'lucide-react';
import { WEEKLY_SCHEDULE, SUBJECTS } from './constants';
import { Task, SmartSuggestion, TaskType, Priority, InputPayload } from './types';
import { parseUserInput, getSmartSuggestion } from './services/geminiService';
import InputBar from './components/InputBar';
import TaskCard from './components/TaskCard';
import SummaryWidget from './components/SummaryWidget';
import WeeklySummaryPanel from './components/WeeklySummaryPanel';
import WeeklyCalendar from './components/WeeklyCalendar';
import MentoringPanel from './components/MentoringPanel';
import PersonalTasksPanel from './components/PersonalTasksPanel';

// Initial dummy data - EMPTY
const INITIAL_TASKS: Task[] = [];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('camilo_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SmartSuggestion | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  
  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<'PRIORITY' | 'SUBJECT' | 'CALENDAR'>('PRIORITY');
  const [subFilter, setSubFilter] = useState<string | null>(null); // 'HIGH', 'MEDIUM', 'Subject Name', etc.
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    localStorage.setItem('camilo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSuggestion = async () => {
      const result = await getSmartSuggestion(tasks);
      if (result) {
        setSuggestion({
          text: result.suggestionText,
          type: result.category as any
        });
      }
    };
    fetchSuggestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Structured Input from the new InputBar
  const handleInputPayload = async (payload: InputPayload) => {
    setAiLoading(true);
    setLastMessage(null);

    try {
      if (payload.type === 'TASK') {
        const newTask: Task = {
          id: Date.now().toString(),
          title: payload.data.title || 'Nueva Tarea',
          type: payload.data.subject ? TaskType.ACADEMIC : TaskType.OTHER,
          priority: payload.data.priority || Priority.MEDIUM,
          dueDate: payload.data.date || new Date().toISOString(),
          completed: false,
          description: payload.data.title, // Simplified for now
          subject: payload.data.subject
        };
        setTasks(prev => [...prev, newTask]);
        setLastMessage("Tarea agregada correctamente.");
        setAiLoading(false);
      } 
      else if (payload.type === 'MEETING') {
        // For now, we add meetings as tasks with specific formatting, or could be a separate event state
        // Let's treat it as a "Personal" task with specific time in title for simplicity in this demo
        const newEvent: Task = {
          id: Date.now().toString(),
          title: `Reunión: ${payload.data.title} (${payload.data.time})`,
          type: TaskType.PERSONAL,
          priority: Priority.HIGH, // Meetings usually high priority
          dueDate: `${payload.data.date}T${payload.data.time}:00`,
          completed: false
        };
        setTasks(prev => [...prev, newEvent]);
        setLastMessage("Reunión agendada.");
        setAiLoading(false);
      }
      else if (payload.type === 'QUESTION' && payload.data.question) {
        // Use Gemini for questions
        const result = await parseUserInput(payload.data.question);
        if (result) {
           setLastMessage(result.responseMessage);
        }
        setAiLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLastMessage("Hubo un error al procesar tu solicitud.");
      setAiLoading(false);
    }
  };
  
  // Quick Actions Handler
  const handleQuickAction = (actionType: 'MONITORING' | 'TOMORROW_CLASSES' | 'SUMMARY') => {
     setAiLoading(true);
     
     let message = '';

     if (actionType === 'MONITORING') {
         message = "Tus espacios asignados para Monitoría de Estadística son: Jueves de 14:00 a 16:00.";
     } 
     else if (actionType === 'TOMORROW_CLASSES') {
         // Calculate tomorrow's day index (0-6)
         const tomorrow = (new Date().getDay() + 1) % 7;
         const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
         const dayName = days[tomorrow];

         const classes = WEEKLY_SCHEDULE
             .filter(c => c.dayOfWeek === tomorrow)
             .sort((a, b) => a.startTime.localeCompare(b.startTime));

         if (classes.length > 0) {
             const classList = classes.map(c => `${c.subject} (${c.startTime})`).join(', ');
             message = `Para mañana ${dayName} tienes: ${classList}.`;
         } else {
             message = `¡Buenas noticias! Mañana ${dayName} no tienes clases programadas.`;
         }
     } 
     else if (actionType === 'SUMMARY') {
         const pending = tasks.filter(t => !t.completed);
         if (pending.length === 0) {
             message = "¡Todo despejado! No tienes tareas pendientes actualmente.";
         } else {
             const high = pending.filter(t => t.priority === Priority.HIGH).length;
             const med = pending.filter(t => t.priority === Priority.MEDIUM).length;
             const low = pending.filter(t => t.priority === Priority.LOW).length;
             message = `Resumen de pendientes: ${pending.length} en total. (${high} Alta, ${med} Media, ${low} Baja).`;
         }
     }

     setLastMessage(message);
     setAiLoading(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Derived State
  const todayDayOfWeek = new Date().getDay();
  const classesToday = WEEKLY_SCHEDULE.filter(c => c.dayOfWeek === todayDayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  const pendingTasks = tasks.filter(t => !t.completed);

  // Filter Logic
  const getFilteredTasks = () => {
    let filtered = [...pendingTasks];

    if (activeTab === 'PRIORITY') {
        if (subFilter === Priority.HIGH) filtered = filtered.filter(t => t.priority === Priority.HIGH);
        else if (subFilter === Priority.MEDIUM) filtered = filtered.filter(t => t.priority === Priority.MEDIUM);
        else if (subFilter === Priority.LOW) filtered = filtered.filter(t => t.priority === Priority.LOW);
        
        // Sort by priority always
        return filtered.sort((a, b) => {
            const pMap = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
            return pMap[b.priority] - pMap[a.priority];
        });
    }
    
    if (activeTab === 'SUBJECT') {
        if (subFilter) {
            filtered = filtered.filter(t => t.subject === subFilter);
        }
        return filtered;
    }

    return filtered;
  };

  const visibleTasks = getFilteredTasks();

  const getDayName = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[todayDayOfWeek];
  }

  // Handle Tab Switch (reset subfilters)
  const switchTab = (tab: 'PRIORITY' | 'SUBJECT' | 'CALENDAR') => {
      setActiveTab(tab);
      setSubFilter(null);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col pb-40 font-sans text-slate-800 selection:bg-violet-100">
      
      {/* Header Glassmorphic */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50' : 'bg-transparent py-2'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-none">Asistente Personal</h1>
              <p className="text-xs text-slate-500 font-medium">Camilo Henriquez</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm font-medium bg-white/60 px-4 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
            <span className="text-slate-400 capitalize">{getDayName()}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-slate-700">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:px-6 space-y-6 mt-4">
        
        {/* Top Section: Summary & Quick Stats */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SummaryWidget 
            suggestion={suggestion} 
            taskCount={pendingTasks.length} 
            classesToday={classesToday.length}
          />
        </section>

        {/* Weekly Summary Panel */}
        <WeeklySummaryPanel />

        {/* AI Response Message Area */}
        {lastMessage && (
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm border border-violet-100 text-violet-800 p-4 rounded-2xl flex items-start gap-3 animate-in zoom-in-95 duration-300 shadow-lg shadow-violet-100/50 mb-6">
            <div className="bg-violet-100 p-2 rounded-full shrink-0">
              <MessageSquare className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-sm font-medium pt-1">{lastMessage}</p>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area (Left - Tasks & Calendar) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Control Center */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
              
              {/* Main Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 p-4 bg-white sticky top-0 z-10">
                <div className="flex p-1 bg-slate-100/80 rounded-xl gap-1">
                  <button 
                    onClick={() => switchTab('PRIORITY')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'PRIORITY' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <Zap className="w-4 h-4" />
                    Prioridad
                  </button>
                  <button 
                    onClick={() => switchTab('SUBJECT')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'SUBJECT' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <Book className="w-4 h-4" />
                    Materias
                  </button>
                  <button 
                    onClick={() => switchTab('CALENDAR')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'CALENDAR' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Horario
                  </button>
                </div>
              </div>

              {/* Sub-Filters / Secondary Nav */}
              <div className="bg-slate-50/50 px-6 pt-4 pb-2 border-b border-slate-100/50">
                  {/* Priority Filters */}
                  {activeTab === 'PRIORITY' && (
                      <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <button onClick={() => setSubFilter(null)} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${subFilter === null ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}>Todas</button>
                          <button onClick={() => setSubFilter(Priority.HIGH)} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${subFilter === Priority.HIGH ? 'bg-rose-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-rose-600'}`}>Alta</button>
                          <button onClick={() => setSubFilter(Priority.MEDIUM)} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${subFilter === Priority.MEDIUM ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-amber-600'}`}>Media</button>
                          <button onClick={() => setSubFilter(Priority.LOW)} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${subFilter === Priority.LOW ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-emerald-600'}`}>Baja</button>
                      </div>
                  )}

                  {/* Subject Filters */}
                  {activeTab === 'SUBJECT' && (
                       <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-in fade-in slide-in-from-top-1 duration-200">
                          <button onClick={() => setSubFilter(null)} className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-colors ${subFilter === null ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}>Todas</button>
                          {SUBJECTS.map(subj => (
                              <button 
                                key={subj} 
                                onClick={() => setSubFilter(subj)} 
                                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${subFilter === subj ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-indigo-600'}`}
                              >
                                  {subj}
                              </button>
                          ))}
                       </div>
                  )}
                  
                  {activeTab === 'CALENDAR' && (
                      <div className="text-xs font-medium text-slate-400 py-1">Vista semanal de clases y laboratorios</div>
                  )}
              </div>

              {/* Dynamic Content */}
              <div className="p-6 bg-slate-50/30 flex-1">
                
                {activeTab !== 'CALENDAR' ? (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <ListFilter className="w-4 h-4"/>
                        {subFilter ? `Filtrado: ${subFilter}` : 'Lista Completa'}
                      </h3>
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">{visibleTasks.length}</span>
                    </div>

                    {visibleTasks.length > 0 ? (
                      visibleTasks.map(task => (
                        <TaskCard key={task.id} task={task} onToggle={toggleTask} />
                      ))
                    ) : (
                      <EmptyState 
                        icon={subFilter ? XCircle : CheckSquare} 
                        text={subFilter ? "No hay tareas con este filtro." : "¡Todo al día! No tienes pendientes."} 
                      />
                    )}
                  </div>
                ) : (
                  <div className="animate-in fade-in zoom-in-95 duration-300 h-full">
                    <WeeklyCalendar />
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Today's Schedule Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
              
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-800 relative z-10">
                <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
                Agenda de Hoy
              </h2>
              
              <div className="space-y-4 relative z-10">
                {classesToday.length > 0 ? (
                  classesToday.map((cls, idx) => (
                    <div key={cls.id} className="flex gap-4 items-start group/item">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-indigo-600">{cls.startTime}</span>
                        <div className="w-0.5 h-full bg-slate-100 my-1 group-last/item:hidden"></div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 flex-1 border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-md hover:border-indigo-100">
                        <h4 className="font-bold text-sm text-slate-800 leading-tight mb-1">{cls.subject}</h4>
                        {cls.room && <span className="text-xs text-slate-400 flex items-center gap-1">Salón {cls.room}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                   <EmptyState icon={Calendar} text="Día libre de clases. ¡Aprovecha!" small />
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-2xl shadow-slate-400/50 relative overflow-hidden">
               {/* Decorative circles */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

               <h3 className="font-bold mb-4 flex items-center gap-2 relative z-10">
                 <Plus className="w-5 h-5 text-violet-300" /> 
                 Acciones Rápidas
               </h3>
               
               <div className="space-y-3 relative z-10">
                <QuickActionButton 
                  onClick={() => handleQuickAction("MONITORING")}
                  icon={<Zap className="w-4 h-4 text-yellow-300" />}
                  text="Consultar espacios monitoría"
                />
                <QuickActionButton 
                  onClick={() => handleQuickAction("TOMORROW_CLASSES")}
                  icon={<Calendar className="w-4 h-4 text-cyan-300" />}
                  text="Consultar Clases Mañana"
                />
                <QuickActionButton 
                  onClick={() => handleQuickAction("SUMMARY")}
                  icon={<Book className="w-4 h-4 text-pink-300" />}
                  text="Resumir Pendientes"
                />
               </div>
            </div>

            {/* Mentoring Panel */}
            <MentoringPanel />

            {/* Personal Tasks Panel */}
            <PersonalTasksPanel />

          </div>
        </div>
      </main>

      <InputBar onSend={handleInputPayload} isLoading={aiLoading} />
    </div>
  );
};

const EmptyState = ({ icon: Icon, text, small = false }: { icon: any, text: string, small?: boolean }) => (
  <div className={`flex flex-col items-center justify-center text-slate-400 ${small ? 'py-8' : 'py-20'}`}>
    <div className={`${small ? 'p-3' : 'p-4'} bg-slate-100 rounded-full mb-3`}>
      <Icon className={`${small ? 'w-6 h-6' : 'w-8 h-8'} opacity-50`} />
    </div>
    <p className={`text-center font-medium ${small ? 'text-xs' : 'text-sm'}`}>{text}</p>
  </div>
);

const QuickActionButton = ({ onClick, icon, text }: { onClick: () => void, icon: any, text: string }) => (
  <button 
    onClick={onClick} 
    className="w-full text-left text-xs font-medium bg-white/10 hover:bg-white/20 p-3.5 rounded-xl transition-all duration-200 flex items-center gap-3 border border-white/5 shadow-inner backdrop-blur-sm group"
  >
    <div className="p-1.5 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
    <span>{text}</span>
  </button>
);

export default App;
