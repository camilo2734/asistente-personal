import { GoogleGenAI, Type, Schema } from "@google/genai";
import { USER_PROFILE, WEEKLY_SCHEDULE, SUBJECTS } from "../constants";
import { Task, TaskType, Priority } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Eres el asistente personal digital exclusivo para ${USER_PROFILE.name}.
Edad: ${USER_PROFILE.age} años.
Universidad: ${USER_PROFILE.university}.
Programa: ${USER_PROFILE.program}.
Rol Adicional: ${USER_PROFILE.role}.

TU COMPORTAMIENTO DEBE SER ESTRICTO Y BASADO EN HECHOS.
NO INVENTES INFORMACIÓN, TEMAS NI FECHAS QUE NO HAYAN SIDO PROPORCIONADOS.

--- REGLAS ESPECÍFICAS: SECCIÓN DE MONITORÍA DE ESTADÍSTICA ---

El usuario podrá solicitar las siguientes acciones. Debes identificar la intención correctamente.

1. REGISTRAR TEMA DE MONITORÍA:
   - Acción: Detectar el tema exacto.
   - Respuesta texto: "Tema visto: [Tema exacto]"
   - Regla: Solo usar el tema que el usuario indique. No agregar contenidos no mencionados.

2. REGISTRAR FECHA DE MONITORÍA:
   - Acción: Detectar fecha y hora.
   - Respuesta texto: "Fecha: [Fecha formateada]"
   - Regla: No asumir fechas futuras. Si falta información, pídela.

3. ELABORAR TALLER DE LA MONITORÍA:
   - Acción: Generar ejercicios.
   - Contenido: Ejercicios completos y resueltos adaptados a Estadística 1.
   - Regla ABSOLUTA: Basarse ÚNICAMENTE en los temas que el usuario mencione en el prompt o temas explícitos de Estadística descriptiva/inferencial básica si se pide ayuda general, pero priorizando lo registrado. NO incluir contenidos avanzados no solicitados.

--- GESTIÓN GENERAL ---
- Si el usuario agrega una tarea, infiere fecha y prioridad.
- Responde de forma clara y concisa.
`;

// Schema for parsing user input
const taskExtractionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    intent: { 
      type: Type.STRING, 
      enum: ['ADD_TASK', 'QUERY', 'CHAT', 'ADD_MENTORING_TOPIC', 'GENERATE_WORKSHOP'], 
      description: "The user's intention. Use ADD_MENTORING_TOPIC if they want to register a topic seen in class." 
    },
    mentoringData: {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING, description: "The specific statistics topic to add (e.g., 'Distribución Normal')" },
        workshopContent: { type: Type.STRING, description: "If intent is GENERATE_WORKSHOP, put the full exercises text here." }
      },
      nullable: true
    },
    taskDetails: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        type: { type: Type.STRING, enum: Object.values(TaskType) },
        priority: { type: Type.STRING, enum: Object.values(Priority) },
        dueDate: { type: Type.STRING, description: "ISO Date string YYYY-MM-DD" },
        description: { type: Type.STRING },
        subject: { type: Type.STRING, enum: [...SUBJECTS, 'Otro'] }
      },
      nullable: true
    },
    responseMessage: { type: Type.STRING, description: "The strict text response requested (e.g., 'Tema visto: ...')" }
  },
  required: ['intent', 'responseMessage']
};

export const parseUserInput = async (input: string): Promise<any> => {
  if (!apiKey) throw new Error("API Key missing");

  const today = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().toLocaleDateString('es-ES', { weekday: 'long' });

  const prompt = `
    Hoy es: ${dayOfWeek}, ${today}.
    Input del usuario: "${input}"
    
    Analiza la intención estrictamente.
    Si pide "Registrar tema" o "Vimos tal tema" -> intent: ADD_MENTORING_TOPIC.
    Si pide "Taller" o "Ejercicios" -> intent: GENERATE_WORKSHOP.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: taskExtractionSchema
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

// Schema for daily suggestion
const suggestionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    suggestionText: { type: Type.STRING, description: "Detailed advice customized for Camilo" },
    category: { type: Type.STRING, enum: ['STUDY', 'REST', 'PRIORITY', 'GENERAL'] }
  }
};

export const getSmartSuggestion = async (tasks: Task[]): Promise<any> => {
  if (!apiKey) return { suggestionText: "Configura tu API Key para recibir consejos inteligentes.", category: "GENERAL" };

  const dayOfWeek = new Date().getDay();
  const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayOfWeek];
  
  const pendingTasks = tasks.filter(t => !t.completed).map(t => `${t.title} (${t.priority})`).join(', ');

  const prompt = `
    Hoy es ${dayName}.
    Usuario: Camilo Henriquez (${USER_PROFILE.role}).
    Tareas pendientes: ${pendingTasks || 'Ninguna'}.
    
    Genera una recomendación estratégica (máx 2 oraciones).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: suggestionSchema
      }
    });
    
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Suggestion Error:", error);
    return { suggestionText: "No pude generar una recomendación ahora.", category: "GENERAL" };
  }
};