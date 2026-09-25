export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
export const weekdays: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
export interface LessonOption {
  subject: string; teacher: string; room: string; variant?: string; empty?: boolean;
  issue?: string; sourceSuffix?: string; sourceText: string[]; sourceColumn: number;
}
export interface Lesson {
  period: number; startTime: string; endTime: string; options: LessonOption[];
  sourceTime: string; sourceRow: number;
}
export interface DaySchedule { day: Day; sourceDay: string; lessons: Lesson[] }
export interface GroupSchedule {
  group: string; course: 1 | 2; groupLanguage: 'uz' | 'ru'; academicYear: string; semester: number;
  sourceFile: string; sourceTable: number; schedule: DaySchedule[];
}
