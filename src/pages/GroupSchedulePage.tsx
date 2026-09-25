import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, Star, LayoutGrid, List, CalendarDays } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getGroup } from '../data/schedules';
import { weekdays, type Day } from '../data/types';
import { useCurrentLesson, useFavoriteGroup, useLastGroup } from '../hooks/useCurrentLesson';
import { DayTabs } from '../components/DayTabs';
import { LessonCard } from '../components/LessonCard';
import { ScheduleTable } from '../components/ScheduleTable';

export function GroupSchedulePage() {
  const { course, group: groupId } = useParams<{ course: string; group: string }>();
  const { t, lang } = useLanguage();
  const courseNum = course?.replace('-kurs', '') || '';

  const groupData = getGroup(groupId);
  const { dayIndex, isWeekend, statuses } = useCurrentLesson(groupData?.schedule);
  const { get: getFav, set: setFav, remove: removeFav } = useFavoriteGroup();
  const { set: setLast } = useLastGroup();
  const [isFavorite, setIsFavorite] = useState(false);
  const [view, setView] = useState<'day' | 'week'>('day');

  // Initial selected day — today if weekday, else Monday
  const [selectedDay, setSelectedDay] = useState<Day>(() => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tashkent' }));
    const jsDay = now.getDay();
    if (jsDay >= 1 && jsDay <= 5) return weekdays[jsDay - 1];
    return 'monday';
  });

  useEffect(() => {
    if (groupId) {
      setLast(groupId);
      setIsFavorite(getFav() === groupId);
    }
  }, [groupId, getFav, setLast]);

  const toggleFavorite = () => {
    if (!groupId) return;
    if (isFavorite) {
      removeFav();
      setIsFavorite(false);
    } else {
      setFav(groupId);
      setIsFavorite(true);
    }
  };

  // Not found
  if (!groupData) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-surface-800 dark:text-surface-100">{t.notFound}</h1>
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{t.notFoundHint}</p>
        <Link
          to={`/${courseNum}-kurs`}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
        >
          {t.viewGroups}
        </Link>
      </div>
    );
  }

  const selectedDaySchedule = groupData.schedule.find(d => d.day === selectedDay);
  const todaySchedule = !isWeekend && groupData.schedule[dayIndex] ? groupData.schedule[dayIndex] : null;
  const hasLessonsToday = todaySchedule?.lessons.some(l => l.options.some(o => !o.empty));
  const selectedDayHasContent = selectedDaySchedule?.lessons.some(l => l.options.some(o => !o.empty));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <Link
        to={`/${courseNum}-kurs`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 transition-colors"
      >
        <ChevronLeft size={16} />
        {t.course(Number(courseNum))}
      </Link>

      {/* Group header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {t.group(groupData.group)}
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            {t.course(groupData.course)} • {groupData.academicYear} • {t.semester}
            {groupData.groupLanguage === 'ru' ? ` • ${lang === 'uz' ? t.ruGroup : t.ruGroup}` : ''}
          </p>
        </div>
        <button
          onClick={toggleFavorite}
          className={`shrink-0 p-2 rounded-lg transition-colors ${
            isFavorite
              ? 'text-primary-500 bg-primary-50 dark:bg-primary-950'
              : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
          aria-label={isFavorite ? t.removeFavorite : t.saveGroup}
          title={isFavorite ? t.removeFavorite : t.saveGroup}
        >
          <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Today's lessons (only shown when it's a weekday) */}
      {!isWeekend && todaySchedule && hasLessonsToday && selectedDay === weekdays[dayIndex] && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-950/30">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={16} className="text-green-600 dark:text-green-400" />
            <h2 className="text-sm font-semibold text-green-700 dark:text-green-300">
              {t.todayLessons}
            </h2>
          </div>
          <div className="space-y-2">
            {todaySchedule.lessons
              .filter(l => l.options.some(o => !o.empty))
              .map(lesson => (
                <LessonCard key={lesson.period} lesson={lesson} status={statuses.get(lesson.period)} />
              ))}
          </div>
        </div>
      )}

      {isWeekend && selectedDay === 'monday' && (
        <div className="mb-6 rounded-xl border border-surface-200 bg-surface-50 p-6 text-center dark:border-surface-700 dark:bg-surface-800">
          <p className="text-sm text-surface-500 dark:text-surface-400">{t.noToday}</p>
        </div>
      )}

      {/* View toggle & Day tabs */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <DayTabs selected={selectedDay} onSelect={setSelectedDay} todayIndex={dayIndex} />
        <div className="hidden lg:flex shrink-0 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
          <button
            onClick={() => setView('day')}
            className={`p-2 transition-colors ${view === 'day' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400' : 'text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'}`}
            aria-label={t.dayView}
            title={t.dayView}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView('week')}
            className={`p-2 transition-colors ${view === 'week' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400' : 'text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'}`}
            aria-label={t.weekView}
            title={t.weekView}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Schedule content */}
      {view === 'week' ? (
        <div className="hidden lg:block">
          <ScheduleTable schedule={groupData.schedule} />
        </div>
      ) : null}

      {/* Day view (mobile + tablet, or when day view selected on desktop) */}
      {(view === 'day' || view === 'week') && (
        <div className={view === 'week' ? 'lg:hidden' : ''}>
          {selectedDayHasContent ? (
            <div className="space-y-3">
              {selectedDaySchedule!.lessons.map(lesson => (
                <LessonCard
                  key={lesson.period}
                  lesson={lesson}
                  status={selectedDay === weekdays[dayIndex] ? statuses.get(lesson.period) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-surface-200 bg-white p-8 text-center dark:border-surface-700 dark:bg-surface-800">
              <p className="text-sm text-surface-500 dark:text-surface-400">{t.emptyDay}</p>
            </div>
          )}
        </div>
      )}

      {/* Source note */}
      <p className="mt-6 text-center text-xs text-surface-400 dark:text-surface-500">
        {t.source}
      </p>
    </div>
  );
}
