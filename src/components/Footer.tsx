import { useLanguage } from '../hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="no-print mt-auto border-t border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-900">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center">
        <p className="text-sm font-medium text-surface-600 dark:text-surface-400">{t.footer}</p>
        <p className="mt-1 text-xs text-surface-400 dark:text-surface-500">{t.footerNote}</p>
      </div>
    </footer>
  );
}
