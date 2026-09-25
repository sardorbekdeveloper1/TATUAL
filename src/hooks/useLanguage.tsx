import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { uz, type Dictionary } from '../locales/uz';
import { ru } from '../locales/ru';

type Lang = 'uz' | 'ru';

interface LanguageContextValue {
  lang: Lang;
  t: Dictionary;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const dictionaries: Record<Lang, Dictionary> = { uz, ru };
const STORAGE_KEY = 'tatu-lang';

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'uz', t: uz, setLang: () => {}, toggle: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem(STORAGE_KEY) as Lang) || 'uz'; }
    catch { return 'uz'; }
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'uz' ? 'ru' : 'uz');
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, t: dictionaries[lang], setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() { return useContext(LanguageContext); }
