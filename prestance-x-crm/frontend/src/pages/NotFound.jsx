import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 px-4 text-center">
      <p className="text-6xl font-bold text-gold-600">404</p>
      <h1 className="mt-4 text-xl font-semibold text-ink-900">{t('notFound.title')}</h1>
      <p className="mt-2 text-sm text-ink-500">{t('notFound.subtitle')}</p>
      <Link to="/dashboard" className="btn-primary mt-6">
        {t('notFound.backToDashboard')}
      </Link>
    </div>
  );
};

export default NotFound;
