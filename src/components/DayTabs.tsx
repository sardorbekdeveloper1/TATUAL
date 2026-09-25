import { useLanguage } from '../hooks/useLanguage';
import { weekdays, type Day } from '../data/types';

interface DayTabsProps {
  selected: Day;
  onSelect: (day: Day) => void;
  todayIndex: number; // 0-4 or -1
}

export function DayTabs({ selected, onSelect, todayIndex }: DayTabsProps) {
  const { t } = useLanguage();

  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t.week}>
      {weekdays.map((day, i) => {
        const isSelected = selected === day;
        const isToday = i === todayIndex;
        return (
          <button
            key={day}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(day)}
            className={`relative whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all shrink-0 min-w-[80px]
              ${isSelected
                ? 'bg-primary-500 text-white shadow-sm dark:bg-primary-600'
                : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50 dark:bg-surface-800 dark:text-surface-400 dark:border-surface-700 dark:hover:bg-surface-750'
              }`}
          >
            {t.weekdays[day]}
            {isToday && (
              <span className={`absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 ${isSelected ? 'bg-white border-primary-500 dark:border-primary-600' : 'bg-primary-500 border-white dark:border-surface-800'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
