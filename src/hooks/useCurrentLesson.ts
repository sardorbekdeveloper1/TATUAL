import { useMemo } from 'react';
import type { DaySchedule } from '../data/types';

const TZ = 'Asia/Tashkent';

function getTashkentDate(): Date {
  const now = new Date();
  const tashkent = new Date(now.toLocaleString('en-US', { timeZone: TZ }));
  return tashkent;
}

export type LessonStatus = 'now' | 'next' | 'ended' | 'upcoming';

interface CurrentLessonInfo {
  dayIndex: number; // 0=Monday..4=Friday, -1=weekend
  isWeekend: boolean;
  statuses: Map<number, LessonStatus>;
  currentMinutes: number;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function useCurrentLesson(schedule: DaySchedule[] | undefined): CurrentLessonInfo {
  return useMemo(() => {
    const now = getTashkentDate();
    const jsDay = now.getDay(); // 0=Sun, 1=Mon...6=Sat
    const dayIndex = jsDay >= 1 && jsDay <= 5 ? jsDay - 1 : -1;
    const isWeekend = dayIndex === -1;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const statuses = new Map<number, LessonStatus>();

    if (!isWeekend && schedule && schedule[dayIndex]) {
      const dayLessons = schedule[dayIndex].lessons;
      let foundCurrent = false;
      let foundNext = false;

      for (const lesson of dayLessons) {
        if (lesson.options.length === 0 || lesson.options.every(o => o.empty)) continue;

        const start = timeToMinutes(lesson.startTime);
        const end = timeToMinutes(lesson.endTime);

        if (currentMinutes >= start && currentMinutes < end) {
          statuses.set(lesson.period, 'now');
          foundCurrent = true;
        } else if (currentMinutes < start && !foundNext) {
          if (foundCurrent || !foundNext) {
            statuses.set(lesson.period, 'next');
            foundNext = true;
          }
        } else if (currentMinutes >= end) {
          statuses.set(lesson.period, 'ended');
        } else {
          statuses.set(lesson.period, 'upcoming');
        }
      }

      // If no current found but not yet found next, mark first upcoming as next
      if (!foundCurrent && !foundNext) {
        for (const lesson of dayLessons) {
          if (lesson.options.length === 0 || lesson.options.every(o => o.empty)) continue;
          const start = timeToMinutes(lesson.startTime);
          if (currentMinutes < start) {
            statuses.set(lesson.period, 'next');
            break;
          }
        }
      }
    }

    return { dayIndex, isWeekend, statuses, currentMinutes };
  }, [schedule]);
}

export function useFavoriteGroup() {
  const KEY = 'tatu-favorite-group';

  function get(): string | null {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }

  function set(group: string) {
    try { localStorage.setItem(KEY, group); } catch {}
  }

  function remove() {
    try { localStorage.removeItem(KEY); } catch {}
  }

  return { get, set, remove };
}

export function useLastGroup() {
  const KEY = 'tatu-last-group';

  function get(): string | null {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }

  function set(group: string) {
    try { localStorage.setItem(KEY, group); } catch {}
  }

  return { get, set };
}
