import { useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface QRCardProps {
  course: 1 | 2;
  url: string;
}

export function QRCard({ course, url }: QRCardProps) {
  const { t } = useLanguage();
  const svgRef = useRef<HTMLDivElement>(null);

  const downloadPNG = useCallback(() => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const link = document.createElement('a');
      link.download = `TATU-AL-${course}-kurs-QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
  }, [course]);

  const downloadSVG = useCallback(() => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `TATU-AL-${course}-kurs-QR.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [course]);

  return (
    <div className="flex flex-col items-center rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800">
      <h3 className="mb-1 text-lg font-bold text-surface-800 dark:text-surface-100">
        {t.courseSchedule(course)}
      </h3>
      <p className="mb-4 text-sm text-surface-500 dark:text-surface-400">
        {course === 1 ? t.groupsRange(101, 109) : t.groupsRange(201, 210)}
      </p>

      <div ref={svgRef} className="rounded-xl bg-white p-4">
        <QRCodeSVG
          value={url}
          size={200}
          level="H"
          marginSize={2}
          className="h-auto w-full max-w-[200px]"
        />
      </div>

      <p className="mt-3 text-xs text-surface-400 dark:text-surface-500 break-all text-center max-w-[240px]">
        {url}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={downloadPNG}
          className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-600"
          aria-label={t.downloadPNG}
        >
          <Download size={14} />
          PNG
        </button>
        <button
          onClick={downloadSVG}
          className="flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
          aria-label={t.downloadSVG}
        >
          <Download size={14} />
          SVG
        </button>
      </div>
    </div>
  );
}
