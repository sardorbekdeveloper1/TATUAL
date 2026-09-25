import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useFavoriteGroup, useLastGroup } from '../hooks/useCurrentLesson';

interface GroupSelectorProps {
  course: 1 | 2;
  groups: string[];
}

export function GroupSelector({ course, groups }: GroupSelectorProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const { get: getFav } = useFavoriteGroup();
  const { get: getLast } = useLastGroup();

  const favoriteGroup = getFav();
  const lastGroup = getLast();

  const filtered = useMemo(
    () => query ? groups.filter(g => g.includes(query)) : groups,
    [groups, query]
  );

  // Auto-focus search on desktop
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef && window.innerWidth >= 768) inputRef.focus();
  }, [inputRef]);

  return (
    <div>
      {/* Favorite / last group shortcut */}
      {favoriteGroup && groups.includes(favoriteGroup) && (
        <Link
          to={`/${course}-kurs/${favoriteGroup}`}
          className="mb-4 flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 transition-colors hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950 dark:hover:bg-primary-900"
        >
          <Star size={18} className="shrink-0 text-primary-500 fill-primary-500" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">{t.favorite}</p>
            <p className="text-xs text-primary-600 dark:text-primary-400">{t.returnGroup(favoriteGroup)}</p>
          </div>
          <ArrowRight size={16} className="shrink-0 text-primary-500" />
        </Link>
      )}

      {!favoriteGroup && lastGroup && groups.includes(lastGroup) && (
        <Link
          to={`/${course}-kurs/${lastGroup}`}
          className="mb-4 flex items-center gap-3 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:bg-surface-800 dark:hover:bg-surface-750"
        >
          <ArrowRight size={18} className="shrink-0 text-surface-400" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{t.lastGroup}</p>
            <p className="text-xs text-surface-500 dark:text-surface-400">{t.returnGroup(lastGroup)}</p>
          </div>
        </Link>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
        <input
          ref={setInputRef}
          type="search"
          inputMode="numeric"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t.search}
          aria-label={t.search}
          className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-primary-500 dark:focus:ring-primary-900"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
            aria-label={t.clearSearch}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Group grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {filtered.map(group => (
            <Link
              key={group}
              to={`/${course}-kurs/${group}`}
              className="group flex flex-col items-center justify-center rounded-xl border border-surface-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-primary-300 hover:bg-primary-50 dark:border-surface-700 dark:bg-surface-800 dark:hover:border-primary-600 dark:hover:bg-primary-950 min-h-[72px]"
            >
              <span className="text-lg font-bold text-surface-800 group-hover:text-primary-700 dark:text-surface-100 dark:group-hover:text-primary-300 transition-colors">
                {group}
              </span>
              <span className="mt-0.5 text-xs text-surface-400 dark:text-surface-500">
                {t.group(group).toLowerCase().replace(group, '').trim()}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-surface-200 bg-white p-8 text-center dark:border-surface-700 dark:bg-surface-800">
          <p className="text-sm text-surface-500 dark:text-surface-400">{t.noResults}</p>
          <button
            onClick={() => setQuery('')}
            className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {t.clearSearch}
          </button>
        </div>
      )}
    </div>
  );
}
