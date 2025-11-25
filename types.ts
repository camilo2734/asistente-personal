
export enum TaskType {
  ACADEMIC = 'ACADEMICO',
  PERSONAL = 'PERSONAL',
  MONITOR = 'MONITORIA',
  OTHER = 'OTRO'
}

export enum Priority {
  HIGH = 'ALTA',
  MEDIUM = 'MEDIA',
  LOW = 'BAJA'
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  priority: Priority;
  dueDate: string; // ISO string
  completed: boolean;
  description?: string;
  subject?: string; // Linked subject if applicable
}

export interface ClassSession {
  id: string;
  subject: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ...
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  room?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  university: string;
  program: string;
  role: string;
}

export interface AiResponse {
  action: 'ADD_TASK' | 'ADD_EVENT' | 'QUERY' | 'UNKNOWN';
  data?: any;
  message: string;
}

export interface SmartSuggestion {
  text: string;
  type: 'STUDY' | 'REST' | 'PRIORITY' | 'GENERAL';
}

export interface InputPayload {
  type: 'TASK' | 'MEETING' | 'QUESTION' | 'MENTORING_ENTRY';
  data: {
    title?: string; // For description in Task/Meeting
    subject?: string;
    priority?: Priority;
    date?: string;
    time?: string;
    question?: string;
    mentoringType?: 'TOPIC' | 'DATE' | 'WORKSHOP'; // Specific for mentoring
  };
}

export interface MentoringTopic {
  id: string;
  title: string;
  status: 'PREPARED' | 'IN_PROGRESS' | 'COMPLETED';
  students?: string;
  notes?: string;
}

export type PersonalCategory = 'Hogar' | 'Salud' | 'Finanzas' | 'Compras' | 'Otros';

export interface PersonalTask {
  id: string;
  title: string;
  category: PersonalCategory;
  priority: Priority; // Reusing Priority enum or string
  completed: boolean;
  date?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  category: 'ACADEMIC' | 'MENTORING' | 'PERSONAL';
  completedAt: string; // ISO Date
  details?: string;
}
