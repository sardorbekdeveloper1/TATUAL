import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface CourseCardProps {
  course: 1 | 2;
  groupRange: [number, number];
  groupCount: number;
}

export function CourseCard({ course, groupRange, groupCount }: CourseCardProps) {
  const { t } = useLanguage();

  return (
    <Link
      to={`/${course}-kurs`}
      className="group relative block rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-300 dark:border-surface-700 dark:bg-surface-800 dark:hover:border-primary-600"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
            {t.course(course)}
          </div>
          <h3 className="mt-3 text-lg font-bold text-surface-900 dark:text-surface-100">
            {t.courseSchedule(course)}
          </h3>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            {t.groupsRange(groupRange[0], groupRange[1])} • {t.groupCount(groupCount)}
          </p>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            {t.courseDescription}
          </p>
        </div>
        <div className="shrink-0 rounded-full bg-surface-100 p-2 text-surface-400 transition-colors group-hover:bg-primary-100 group-hover:text-primary-600 dark:bg-surface-700 dark:group-hover:bg-primary-900 dark:group-hover:text-primary-300">
          <ChevronRight size={20} />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700">
        <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300 transition-colors">
          {t.viewSchedule}
          <ChevronRight className="inline ml-1 -mt-0.5" size={14} />
        </span>
      </div>
    </Link>
  );
}
