import { Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../hooks/useLanguage';
import { QRCard } from '../components/QRCard';
import logoSrc from '../assets/logo/original.png';

const CANONICAL_ORIGIN = 'https://tatual.vercel.app';

function getBaseUrl(): string {
  const env = import.meta.env?.VITE_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/+$/, '');
  return CANONICAL_ORIGIN;
}

export function QRPage() {
  const { t } = useLanguage();
  const base = getBaseUrl();

  return (
    <div>
      {/* Screen version */}
      <div className="no-print mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">{t.qrTitle}</h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 max-w-lg mx-auto">{t.qrDescription}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          <QRCard course={1} url={`${base}/1-kurs`} />
          <QRCard course={2} url={`${base}/2-kurs`} />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-5 py-2.5 text-sm font-medium text-surface-700 shadow-sm transition-colors hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
          >
            <Printer size={16} />
            {t.print}
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-surface-200 bg-surface-50 p-4 text-center dark:border-surface-700 dark:bg-surface-800">
          <p className="text-sm text-surface-500 dark:text-surface-400">{t.qrHint}</p>
        </div>
      </div>

      {/* Print version – A4 poster */}
      <div className="hidden print:block w-full" style={{ pageBreakAfter: 'always' }}>
        <div className="flex flex-col items-center justify-center min-h-[100vh] p-12">
          <img src={logoSrc} alt="" className="h-24 w-24 object-contain mb-6" />
          <h1 className="text-3xl font-bold text-center mb-1">{t.brand}</h1>
          <p className="text-lg text-gray-600 mb-8">{t.academicYear}</p>

          <div className="flex gap-16 items-start justify-center mb-8">
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4">{t.courseSchedule(1)}</h2>
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG value={`${base}/1-kurs`} size={220} level="H" marginSize={2} />
              </div>
              <p className="mt-3 text-sm text-gray-500">{t.groupsRange(101, 109)}</p>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4">{t.courseSchedule(2)}</h2>
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG value={`${base}/2-kurs`} size={220} level="H" marginSize={2} />
              </div>
              <p className="mt-3 text-sm text-gray-500">{t.groupsRange(201, 210)}</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-base font-semibold">{t.posterTitle}</p>
            <p className="mt-1 text-sm text-gray-500">{t.scanQR}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
