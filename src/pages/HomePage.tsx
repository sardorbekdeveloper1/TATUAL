import { Link } from 'react-router-dom';
import { Search, CalendarDays, Smartphone, QrCode } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { CourseCard } from '../components/CourseCard';
import logoSrc from '../assets/logo/original.png';

export function HomePage() {
  const { t } = useLanguage();

  const features = [
    { icon: Search, title: t.featureFast, text: t.featureFastText },
    { icon: CalendarDays, title: t.featureToday, text: t.featureTodayText },
    { icon: Smartphone, title: t.featurePhone, text: t.featurePhoneText },
  ];

  return (
    <div className="min-h-[100dvh]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white dark:from-surface-800 dark:via-surface-900 dark:to-surface-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col items-center text-center">
            <img src={logoSrc} alt={t.brand} className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-contain mb-6" width={96} height={96} />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="mt-2 text-lg sm:text-xl text-primary-600 dark:text-primary-400 font-medium">
              {t.academicYear}
            </p>
            <p className="mt-4 max-w-xl text-surface-500 dark:text-surface-400 text-sm sm:text-base leading-relaxed">
              {t.heroDescription}
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/qr"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 shadow-sm"
              >
                <QrCode size={16} />
                {t.openQR}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course cards */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-surface-800 dark:text-surface-100">{t.chooseCourse}</h2>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{t.chooseCourseHint}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
          <CourseCard course={1} groupRange={[101, 109]} groupCount={9} />
          <CourseCard course={2} groupRange={[201, 210]} groupCount={10} />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-surface-200 bg-white p-5 text-center dark:border-surface-700 dark:bg-surface-800">
              <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                <Icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">{title}</h3>
              <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
