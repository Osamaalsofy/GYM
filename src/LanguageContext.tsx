import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

type Language = 'en' | 'ar';

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial language from localStorage or default to English
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('vortex-lang');
    return (stored === 'ar' || stored === 'en') ? stored : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('vortex-lang', newLang);
  };

  const isRtl = lang === 'ar';

  useEffect(() => {
    // Dynamic RTL setup on document element
    const dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    
    // Add class on body for specific styling if needed
    if (isRtl) {
      document.body.classList.add('rtl-mode');
      document.body.classList.remove('ltr-mode');
    } else {
      document.body.classList.add('ltr-mode');
      document.body.classList.remove('rtl-mode');
    }
  }, [lang, isRtl]);

  const t = (key: string): string => {
    const dict = translations[lang] as Record<string, string>;
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English translation
    const enDict = translations['en'] as Record<string, string>;
    return (enDict && enDict[key]) ? enDict[key] : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
