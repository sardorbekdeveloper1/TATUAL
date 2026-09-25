import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { GroupSelector } from '../components/GroupSelector';

const courseGroups: Record<string, string[]> = {
  '1': ['101', '102', '103', '104', '105', '106', '107', '108', '109'],
  '2': ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210'],
};

export function CoursePage() {
  const { course } = useParams<{ course: string }>();
  const { t } = useLanguage();

  const courseNum = course?.replace('-kurs', '') || '';
  const groups = courseGroups[courseNum];

  if (!groups) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-surface-800 dark:text-surface-100">{t.pageNotFound}</h1>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
          {t.home}
        </Link>
      </div>
    );
  }

  const n = Number(courseNum) as 1 | 2;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 transition-colors"
      >
        <ChevronLeft size={16} />
        {t.home}
      </Link>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t.courseSchedule(n)}</h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          {t.courseHint}
        </p>
      </div>

      <GroupSelector course={n} groups={groups} />
    </div>
  );
}
