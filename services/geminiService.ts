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

Materias actuales: ${SUBJECTS.join(', ')}.

Tus responsabilidades:
1. Gestionar listas de tareas, clases y reuniones.
2. Recordar su rol de Monitor de Estadística y sugerir espacios para ello.
3. Detectar sobrecarga académica y sugerir descansos.
4. Responder siempre de forma clara, ordenada y útil ("Dashbord style").

IMPORTANTE:
- Si el usuario agrega una tarea relacionada con una materia, asocia la materia correctamente.
- Si menciona "monitoría", clasifícalo como MONITORIA.
- Organiza por prioridad.
`;

// Schema for parsing user input into a task
const taskExtractionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    intent: { type: Type.STRING, enum: ['ADD_TASK', 'QUERY', 'CHAT'], description: "The user's intention" },
    taskDetails: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        type: { type: Type.STRING, enum: Object.values(TaskType) },
        priority: { type: Type.STRING, enum: Object.values(Priority) },
        dueDate: { type: Type.STRING, description: "ISO Date string YYYY-MM-DD" },
        description: { type: Type.STRING },
        subject: { type: Type.STRING, enum: [...SUBJECTS, 'Otro'], description: "The academic subject related to this task if applicable" }
      },
      nullable: true
    },
    responseMessage: { type: Type.STRING, description: "A friendly, efficient confirmation or response message to Camilo." }
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
    
    Analiza si es una nueva tarea, una consulta de horario o simplemente charla.
    Si es tarea, infiere fecha limite y prioridad basándote en el contexto (ej: "para mañana" es prioridad ALTA).
    Si menciona una materia (${SUBJECTS.join(', ')}), asígnala al campo 'subject'.
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
  const todaysClasses = WEEKLY_SCHEDULE.filter(c => c.dayOfWeek === dayOfWeek).map(c => c.subject).join(', ');

  const prompt = `
    Hoy es ${dayName}.
    Usuario: Camilo Henriquez (${USER_PROFILE.role}).
    Clases de hoy: ${todaysClasses || 'Ninguna'}.
    Tareas pendientes: ${pendingTasks || 'Ninguna'}.
    
    Genera una recomendación estratégica (máx 2 oraciones).
    - Si tiene muchas tareas, prioriza.
    - Si el día es ligero, sugiere adelantar trabajo de Monitoría.
    - Si es fin de semana, sugiere descanso o repaso suave.
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
