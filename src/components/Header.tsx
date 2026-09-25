import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import logoSrc from '../assets/logo/original.png';

export function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: t.home },
    { to: '/1-kurs', label: t.course(1) },
    { to: '/2-kurs', label: t.course(2) },
    { to: '/qr', label: t.qr },
  ];

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <header className="no-print sticky top-0 z-50 border-b border-surface-200 bg-white/90 backdrop-blur-md dark:border-surface-700 dark:bg-surface-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo + brand */}
        <Link to="/" className="flex items-center gap-3 min-w-0" aria-label={t.home}>
          <img src={logoSrc} alt="" className="h-9 w-9 shrink-0 rounded-lg object-contain" width={36} height={36} />
          <span className="hidden sm:block text-sm font-semibold text-surface-800 dark:text-surface-100 leading-tight truncate">
            {t.brand}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label={t.menu}>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive(item.to)
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-800'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t.closeMenu : t.menu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 pb-4 pt-2" aria-label={t.menu}>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-3 rounded-lg text-sm font-medium transition-colors
                ${isActive(item.to)
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                  : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
