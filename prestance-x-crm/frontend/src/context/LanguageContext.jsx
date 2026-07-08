import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'prestance_x_lang';

const getInitialLang = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'fr' || stored === 'en') return stored;
  return 'fr'; // Default language is French
};

// Resolves a dot-path like "leadForm.errFirstName" inside the dictionary
const resolvePath = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

// Replaces {placeholder} tokens with values from the params object
const interpolate = (str, params) => {
  if (!params) return str;
  return Object.keys(params).reduce(
    (acc, key) => acc.replace(new RegExp(`{${key}}`, 'g'), params[key]),
    str
  );
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((newLang) => {
    localStorage.setItem(STORAGE_KEY, newLang);
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  }, [lang, setLang]);

  const t = useCallback(
    (key, params) => {
      const value = resolvePath(translations[lang], key) ?? resolvePath(translations.fr, key) ?? key;
      return typeof value === 'string' ? interpolate(value, params) : value;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
