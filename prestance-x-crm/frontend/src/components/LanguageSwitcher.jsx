import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-lg border border-ink-200 bg-white p-0.5 text-xs font-semibold ${className}`}>
      <button
        onClick={() => setLang('fr')}
        className={`px-2 py-1 rounded-md transition-colors ${
          lang === 'fr' ? 'bg-gold-600 text-ink-900' : 'text-ink-500 hover:text-ink-800'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-md transition-colors ${
          lang === 'en' ? 'bg-gold-600 text-ink-900' : 'text-ink-500 hover:text-ink-800'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
