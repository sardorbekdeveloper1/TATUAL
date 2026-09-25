import { Clock, User, MapPin } from 'lucide-react';
import type { Lesson, LessonOption } from '../data/types';
import type { LessonStatus } from '../hooks/useCurrentLesson';
import { useLanguage } from '../hooks/useLanguage';
import { subjectName } from '../locales/subjects';

interface LessonCardProps {
  lesson: Lesson;
  status?: LessonStatus;
}

function StatusBadge({ status }: { status: LessonStatus }) {
  const { t } = useLanguage();
  const config = {
    now: { label: t.now, cls: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    next: { label: t.next, cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    ended: { label: t.ended, cls: 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400' },
    upcoming: { label: '', cls: '' },
  }[status];

  if (!config.label) return null;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.cls}`}>
      {status === 'now' && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />}
      {config.label}
    </span>
  );
}

function OptionBlock({ option, variant, lang }: { option: LessonOption; variant?: string; lang: 'uz' | 'ru' }) {
  const { t } = useLanguage();

  if (option.empty) {
    return (
      <div className="py-2 text-center text-sm text-surface-400 dark:text-surface-500 italic">
        {t.free}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {variant && (
        <span className="inline-flex items-center rounded-md bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-500 dark:bg-surface-700 dark:text-surface-400">
          {t.option(variant)}
        </span>
      )}
      <p className="font-semibold text-surface-900 dark:text-surface-100 leading-snug">
        {subjectName(option.subject, lang)}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-surface-500 dark:text-surface-400">
        {option.teacher && (
          <span className="flex items-center gap-1.5">
            <User size={14} className="shrink-0 text-surface-400" />
            <span className="break-words">{option.teacher}</span>
          </span>
        )}
        {option.room && (
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-surface-400" />
            <span>{option.room}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export function LessonCard({ lesson, status }: LessonCardProps) {
  const { t, lang } = useLanguage();
  const hasContent = lesson.options.some(o => !o.empty);
  const multiOption = lesson.options.length > 1 && hasContent;

  if (!hasContent) {
    return (
      <div className="rounded-xl border border-dashed border-surface-200 bg-surface-50/50 p-4 dark:border-surface-700 dark:bg-surface-800/50">
        <div className="flex items-center justify-between text-sm text-surface-400 dark:text-surface-500">
          <span className="font-medium">{t.lesson(lesson.period)}</span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {lesson.startTime}–{lesson.endTime}
          </span>
        </div>
        <p className="mt-2 text-center text-sm italic text-surface-400 dark:text-surface-500">{t.free}</p>
      </div>
    );
  }

  const borderClass = status === 'now'
    ? 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30'
    : status === 'next'
    ? 'border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20'
    : 'border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800';

  return (
    <div className={`rounded-xl border p-4 transition-colors ${borderClass}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">{t.lesson(lesson.period)}</span>
          {status && <StatusBadge status={status} />}
        </div>
        <span className="flex items-center gap-1 text-xs text-surface-400 dark:text-surface-500">
          <Clock size={13} />
          {lesson.startTime}–{lesson.endTime}
        </span>
      </div>

      {/* Content */}
      {multiOption ? (
        <div className="space-y-3">
          {lesson.options.filter(o => !o.empty).map((option, i) => (
            <div key={i}>
              {i > 0 && <div className="mb-3 border-t border-dashed border-surface-200 dark:border-surface-600" />}
              <OptionBlock option={option} variant={option.variant || String.fromCharCode(65 + i)} lang={lang} />
            </div>
          ))}
        </div>
      ) : (
        <OptionBlock option={lesson.options[0]} lang={lang} />
      )}
    </div>
  );
}
