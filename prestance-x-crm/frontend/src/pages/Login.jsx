import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/Loader';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login = () => {
  const { login, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    const redirectTo = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success(t('login.welcomeToast'));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || t('login.genericError');
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 px-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher className="!bg-ink-800 !border-ink-700" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gold-600 flex items-center justify-center text-ink-900 font-bold text-xl shadow-lg">
            PX
          </div>
          <h1 className="mt-4 text-2xl font-bold text-cream-50">{t('common.appName')}</h1>
          <p className="text-sm text-ink-300">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-cream-50 rounded-xl shadow-lg border border-ink-800 p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-leather-50 border border-leather-200 px-3 py-2 text-sm text-leather-700">
              {error}
            </div>
          )}

          <div>
            <label className="label" htmlFor="email">
              {t('login.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input"
              placeholder="vous@prestancex.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              {t('login.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? <Loader size="sm" className="border-ink-900 border-t-transparent" /> : t('login.signIn')}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-400">
          {t('login.noRegistration')}
        </p>
      </div>
    </div>
  );
};

export default Login;
