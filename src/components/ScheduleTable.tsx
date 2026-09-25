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
                      <div className="space-y-2">
                        {lesson!.options.filter(o => !o.empty).map((opt, oi) => (
                          <div key={oi} className={oi > 0 ? 'pt-2 border-t border-dashed border-surface-200 dark:border-surface-600' : ''}>
                            {lesson!.options.filter(o => !o.empty).length > 1 && (
                              <span className="text-xs font-medium text-surface-400 dark:text-surface-500">{opt.variant || String.fromCharCode(65 + oi)}</span>
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
                        ))}
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
