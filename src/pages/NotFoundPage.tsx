import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="text-6xl font-bold text-surface-200 dark:text-surface-700">404</div>
      <h1 className="mt-4 text-xl font-bold text-surface-800 dark:text-surface-100">{t.pageNotFound}</h1>
      <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 max-w-md">{t.notFoundHint}</p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/1-kurs"
          className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
        >
          {t.course(1)}
        </Link>
        <Link
          to="/2-kurs"
          className="rounded-xl border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
        >
          {t.course(2)}
        </Link>
      </div>
    </div>
  );
}
