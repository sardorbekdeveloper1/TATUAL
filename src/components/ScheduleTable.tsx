import type { DaySchedule } from '../data/types';
import { weekdays } from '../data/types';
import { useLanguage } from '../hooks/useLanguage';
import { subjectName } from '../locales/subjects';

interface ScheduleTableProps {
  schedule: DaySchedule[];
}

export function ScheduleTable({ schedule }: ScheduleTableProps) {
  const { t, lang } = useLanguage();

  // Collect all unique periods across all days
  const allPeriods = new Map<number, { startTime: string; endTime: string }>();
  for (const day of schedule) {
    for (const lesson of day.lessons) {
      if (!allPeriods.has(lesson.period)) {
        allPeriods.set(lesson.period, { startTime: lesson.startTime, endTime: lesson.endTime });
      }
    }
  }
  const periods = Array.from(allPeriods.entries()).sort((a, b) => a[0] - b[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
      <table className="w-full min-w-[700px] border-collapse text-sm">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-800">
            <th className="border-b border-r border-surface-200 dark:border-surface-700 px-3 py-3 text-left font-semibold text-surface-600 dark:text-surface-400 w-[100px]">
              {t.time}
            </th>
            {weekdays.map(day => (
              <th
                key={day}
                className="border-b border-r last:border-r-0 border-surface-200 dark:border-surface-700 px-3 py-3 text-center font-semibold text-surface-600 dark:text-surface-400"
              >
                {t.weekdays[day]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map(([period, time]) => (
            <tr key={period} className="border-b last:border-b-0 border-surface-200 dark:border-surface-700">
              <td className="border-r border-surface-200 dark:border-surface-700 px-3 py-3 align-top">
                <div className="font-semibold text-surface-700 dark:text-surface-300">{t.lesson(period)}</div>
                <div className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{time.startTime}–{time.endTime}</div>
              </td>
              {weekdays.map((day, di) => {
                const daySchedule = schedule[di];
                const lesson = daySchedule?.lessons.find(l => l.period === period);
                const hasContent = lesson && lesson.options.some(o => !o.empty);

                return (
                  <td
                    key={day}
                    className="border-r last:border-r-0 border-surface-200 dark:border-surface-700 px-3 py-2 align-top"
                  >
                    {hasContent ? (
                      <div className="grid gap-2">
                        {lesson!.options.filter(o => !o.empty).map((opt, oi) => {
                          const isMulti = lesson!.options.filter(o => !o.empty).length > 1;
                          const accent = oi === 0 ? 'border-indigo-400 dark:border-indigo-500' : 'border-amber-400 dark:border-amber-500';
                          return (
                            <div key={oi} className={isMulti ? `border-l-2 ${accent} pl-2` : ''}>
                              {isMulti && (
                                <span className="inline-block mb-0.5 rounded bg-surface-100 px-1.5 py-px text-[11px] font-semibold text-surface-500 dark:bg-surface-700 dark:text-surface-400">
                                  {t.option(opt.variant || String.fromCharCode(65 + oi))}
                                </span>
                              )}
                              <div className="font-medium text-surface-800 dark:text-surface-200 leading-snug">
                                {subjectName(opt.subject, lang)}
                              </div>
                              <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                                {opt.teacher}
                              </div>
                              {opt.room && (
                                <div className="text-xs text-surface-400 dark:text-surface-500">
                                  {opt.room}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-surface-300 dark:text-surface-600 italic">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
