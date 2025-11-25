import { ClassSession, UserProfile } from './types';

export const USER_PROFILE: UserProfile = {
  name: "Camilo Henriquez",
  age: 19,
  university: "Universidad Javeriana",
  program: "Ingeniería Industrial",
  role: "Monitor de Estadística"
};

// 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
export const WEEKLY_SCHEDULE: ClassSession[] = [
  // Lunes
  { id: 'fund-mon', subject: 'Fundamentos de Operaciones', dayOfWeek: 1, startTime: '18:00', endTime: '20:00' },
  { id: 'mod-mon', subject: 'Modelos Estadísticos', dayOfWeek: 1, startTime: '11:00', endTime: '13:00' },
  
  // Martes
  { id: 'fund-tue', subject: 'Fundamentos de Operaciones', dayOfWeek: 2, startTime: '07:00', endTime: '09:00' },
  { id: 'mod-tue', subject: 'Modelos Estadísticos', dayOfWeek: 2, startTime: '14:00', endTime: '16:00' },

  // Miércoles
  { id: 'sim-wed', subject: 'Simulación', dayOfWeek: 3, startTime: '11:00', endTime: '13:00' },

  // Jueves
  { id: 'fund-thu', subject: 'Fundamentos de Operaciones', dayOfWeek: 4, startTime: '07:00', endTime: '09:00' },
  { id: 'cal-thu', subject: 'Gestión y Control de la Calidad', dayOfWeek: 4, startTime: '09:00', endTime: '12:00' },
  { id: 'mod-thu', subject: 'Modelos Estadísticos', dayOfWeek: 4, startTime: '14:00', endTime: '16:00' },

  // Viernes
  { id: 'hab-fri', subject: 'Habilidades Emprendedoras', dayOfWeek: 5, startTime: '07:00', endTime: '09:00' },
  { id: 'sim-fri', subject: 'Simulación', dayOfWeek: 5, startTime: '11:00', endTime: '13:00' },
];

export const SUBJECTS = [
  "Simulación",
  "Fundamentos de Operaciones",
  "Habilidades Emprendedoras",
  "Gestión y Control de la Calidad",
  "Modelos Estadísticos"
];
