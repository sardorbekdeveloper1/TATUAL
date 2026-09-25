import first from './firstCourse.json';
import second from './secondCourse.json';
import type { GroupSchedule } from './types';
export const schedules = [...first, ...second] as GroupSchedule[];
export const getGroup = (group?: string) => schedules.find(g => g.group === group);
export const groupPath = (g: GroupSchedule) => `/${g.course}-kurs/${g.group}`;
