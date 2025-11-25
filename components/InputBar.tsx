
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Plus, Calendar, MessageCircle, CheckCircle2, X, ChevronDown, FlaskConical, AlertCircle } from 'lucide-react';
import { SUBJECTS } from '../constants';
import { Priority, InputPayload } from '../types';

interface InputBarProps {
  onSend: (payload: InputPayload) => void;
  isLoading: boolean;
}

type InputMode = 'IDLE' | 'SELECT_TYPE' | 'FORM_TASK' | 'FORM_MEETING' | 'FORM_QUESTION' | 'FORM_MENTORING';
type MentoringSubType = 'TOPIC' | 'DATE' | 'WORKSHOP';

const InputBar: React.FC<InputBarProps> = ({ onSend, isLoading }) => {
  const [mode, setMode] = useState<InputMode>('IDLE');
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form States
  const [description, setDescription] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>(Priority.MEDIUM);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  // Mentoring Specific States
  const [mentoringSubType, setMentoringSubType] = useState<MentoringSubType>('TOPIC');

  // Reset form when mode changes
  useEffect(() => {
    if (mode === 'IDLE') {
      setIsExpanded(false);
      setDescription('');
      setSelectedSubject('');
      setSelectedPriority(Priority.MEDIUM);
      setDate('');
      setTime('');
      setMentoringSubType('TOPIC');
    } else {
      setIsExpanded(true);
    }
  }, [mode]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMode('IDLE');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;

    if (mode === 'FORM_TASK') {
      if (!description) return;
      onSend({
        type: 'TASK',
        data: {
          title: description,
          subject: selectedSubject || undefined,
          priority: selectedPriority,
          date: date || new Date().toISOString()
        }
      });
    } else if (mode === 'FORM_MEETING') {
      if (!description || !date || !time) return;
      onSend({
        type: 'MEETING',
        data: {
          title: description,
          date: date,
          time: time
        }
      });
    } else if (mode === 'FORM_QUESTION') {
      if (!description) return;
      onSend({
        type: 'QUESTION',
        data: {
          question: description
        }
      });
    } else if (mode === 'FORM_MENTORING') {
      if (!description || !date || !time) return;
      onSend({
        type: 'MENTORING_ENTRY',
        data: {
          mentoringType: mentoringSubType,
          title: description, // The description acts as the content (Topic Name, Workshop details, etc.)
          date: date,
          time: time
        }
      });
    }

    setMode('IDLE');
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
      <div 
        ref={containerRef}
        className={`w-full max-w-2xl pointer-events-auto transition-all duration-500 ease-in-out ${isExpanded ? 'translate-y-0' : 'translate-y-0'}`}
      >
        <div className={`bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-indigo-900/20 overflow-hidden transition-all duration-500 ${isExpanded ? 'p-6' : 'p-2'}`}>
          
          {/* INITIAL STATE: Search Bar style input that expands */}
          {mode === 'IDLE' && (
            <div 
              onClick={() => setMode('SELECT_TYPE')}
              className="flex items-center gap-3 p-2 cursor-pointer group"
            >
              <div className="bg-indigo-600 p-2.5 rounded-full text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-slate-500 font-medium text-lg">Escribe una tarea, reunión o pregunta...</span>
            </div>
          )}

          {/* STEP 1: SELECT TYPE */}
          {mode === 'SELECT_TYPE' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-700">¿Qué deseas agregar?</h3>
                <button onClick={() => setMode('IDLE')} className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button 
                  onClick={() => setMode('FORM_TASK')}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 transition-all hover:shadow-md"
                >
                  <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><CheckCircle2 className="w-6 h-6"/></div>
                  <span className="font-semibold text-sm">Tarea</span>
                </button>
                
                <button 
                  onClick={() => setMode('FORM_MEETING')}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border border-slate-100 transition-all hover:shadow-md"
                >
                  <div className="bg-pink-100 p-3 rounded-full text-pink-600"><Calendar className="w-6 h-6"/></div>
                  <span className="font-semibold text-sm">Reunión</span>
                </button>

                <button 
                  onClick={() => setMode('FORM_MENTORING')}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-100 transition-all hover:shadow-md"
                >
                  <div className="bg-orange-100 p-3 rounded-full text-orange-600"><FlaskConical className="w-6 h-6"/></div>
                  <span className="font-semibold text-sm">Monitoría</span>
                </button>
                
                <button 
                  onClick={() => setMode('FORM_QUESTION')}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:text-sky-600 border border-slate-100 transition-all hover:shadow-md"
                >
                  <div className="bg-sky-100 p-3 rounded-full text-sky-600"><MessageCircle className="w-6 h-6"/></div>
                  <span className="font-semibold text-sm">Pregunta</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FORMS */}
          {mode !== 'IDLE' && mode !== 'SELECT_TYPE' && (
            <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setMode('SELECT_TYPE')} className="text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center gap-1">
                        <ChevronDown className="w-4 h-4 rotate-90" /> Volver
                    </button>
                    <h3 className="text-lg font-bold text-slate-800">
                        {mode === 'FORM_TASK' && 'Nueva Tarea'}
                        {mode === 'FORM_MEETING' && 'Nueva Reunión'}
                        {mode === 'FORM_QUESTION' && 'Consultar al Asistente'}
                        {mode === 'FORM_MENTORING' && 'Monitoría de Estadística'}
                    </h3>
                </div>
                <button type="button" onClick={() => setMode('IDLE')} className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5"/></button>
              </div>

              {/* TASK FORM FIELDS */}
              {mode === 'FORM_TASK' && (
                <div className="space-y-3">
                   {/* Subject Selector */}
                   <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      <button
                         type="button"
                         onClick={() => setSelectedSubject('')}
                         className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${!selectedSubject ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                         General
                      </button>
                      {SUBJECTS.map(subj => (
                        <button
                            key={subj}
                            type="button"
                            onClick={() => setSelectedSubject(subj)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${selectedSubject === subj ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                            {subj}
                        </button>
                      ))}
                   </div>

                   <div className="flex gap-4">
                       {/* Date Picker */}
                       <div className="flex-1">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Fecha Límite</label>
                           <input 
                              type="date" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                           />
                       </div>

                       {/* Priority Selector */}
                       <div className="flex-1">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Prioridad</label>
                           <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-200">
                               {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map((p) => (
                                   <button
                                      key={p}
                                      type="button"
                                      onClick={() => setSelectedPriority(p)}
                                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedPriority === p ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                                   >
                                      {p === Priority.HIGH ? 'Alta' : p === Priority.MEDIUM ? 'Media' : 'Baja'}
                                   </button>
                               ))}
                           </div>
                       </div>
                   </div>

                   {/* Description */}
                   <div>
                       <input 
                          autoFocus
                          type="text" 
                          placeholder="¿Qué tienes que hacer?" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                       />
                   </div>
                </div>
              )}

              {/* MEETING FORM FIELDS */}
              {mode === 'FORM_MEETING' && (
                  <div className="space-y-3">
                      <div className="flex gap-4">
                          <div className="flex-1">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Fecha</label>
                              <input 
                                type="date" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                              />
                          </div>
                          <div className="flex-1">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Hora</label>
                              <input 
                                type="time" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                              />
                          </div>
                      </div>
                      <div>
                       <input 
                          autoFocus
                          type="text" 
                          placeholder="Título de la reunión..." 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                       />
                   </div>
                  </div>
              )}

               {/* MENTORING FORM FIELDS (NEW) */}
               {mode === 'FORM_MENTORING' && (
                  <div className="space-y-3">
                      
                      {/* Sub-type Selector */}
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Tipo de Registro</label>
                          <select 
                            value={mentoringSubType}
                            onChange={(e) => setMentoringSubType(e.target.value as MentoringSubType)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                          >
                              <option value="TOPIC">Tema de monitoría</option>
                              <option value="DATE">Fecha de monitoría</option>
                              <option value="WORKSHOP">Taller de monitoría</option>
                          </select>
                      </div>

                      {/* Date & Time (Mandatory) */}
                      <div className="flex gap-4">
                          <div className="flex-1">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Fecha</label>
                              <input 
                                type="date" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                              />
                          </div>
                          <div className="flex-1">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Hora</label>
                              <input 
                                type="time" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                              />
                          </div>
                      </div>

                      {/* Description / Content */}
                      <div>
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                           {mentoringSubType === 'TOPIC' && 'Tema Visto'}
                           {mentoringSubType === 'DATE' && 'Notas (Opcional)'}
                           {mentoringSubType === 'WORKSHOP' && 'Descripción del Taller'}
                       </label>
                       <textarea 
                          autoFocus
                          rows={2}
                          placeholder={
                              mentoringSubType === 'TOPIC' ? "Ej: Distribución Normal..." : 
                              mentoringSubType === 'WORKSHOP' ? "Ej: Ejercicios del capítulo 4..." :
                              "Nota sobre la sesión..."
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                       />
                   </div>
                  </div>
              )}

              {/* QUESTION FORM FIELDS */}
              {mode === 'FORM_QUESTION' && (
                  <div>
                      <textarea 
                          autoFocus
                          rows={3}
                          placeholder="Pregúntale algo a tu asistente..." 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                       />
                       <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                           <AlertCircle className="w-3 h-3"/>
                           La IA analizará tu agenda y tareas para responderte.
                       </p>
                  </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading || !description || (mode === 'FORM_MENTORING' && (!date || !time))}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2
                    ${mode === 'FORM_TASK' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : ''}
                    ${mode === 'FORM_MEETING' ? 'bg-pink-600 hover:bg-pink-700 shadow-pink-200' : ''}
                    ${mode === 'FORM_MENTORING' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' : ''}
                    ${mode === 'FORM_QUESTION' ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-200' : ''}
                    ${isLoading || !description || (mode === 'FORM_MENTORING' && (!date || !time)) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
                `}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {mode === 'FORM_TASK' && 'Guardar Tarea'}
                {mode === 'FORM_MEETING' && 'Agendar Reunión'}
                {mode === 'FORM_MENTORING' && 'Registrar Monitoría'}
                {mode === 'FORM_QUESTION' && 'Enviar Pregunta'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default InputBar;
