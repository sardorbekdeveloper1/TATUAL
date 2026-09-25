import { useLanguage } from '../hooks/useLanguage';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { lang, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
      aria-label={lang === 'uz' ? 'Русский' : 'O\'zbekcha'}
      title={lang === 'uz' ? 'Русский' : 'O\'zbekcha'}
    >
      <Languages size={16} />
      <span className="uppercase">{lang === 'uz' ? 'RU' : 'UZ'}</span>
    </button>
  );
}
