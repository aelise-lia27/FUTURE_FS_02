import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiMenu, HiX, HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLanguage();

  const links = [
    { to: '/dashboard', label: t('sidebar.dashboard') },
    { to: '/leads', label: t('sidebar.leads') },
    ...(isAdmin ? [{ to: '/users', label: t('sidebar.users') }] : []),
  ];

  return (
    <header className="md:hidden sticky top-0 z-40 bg-ink-900 border-b border-ink-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gold-600 flex items-center justify-center text-ink-900 font-bold text-sm">
            PX
          </div>
          <span className="font-semibold text-cream-50">{t('common.appName')}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="!bg-ink-800 !border-ink-700" />
          <button onClick={() => setOpen(!open)} className="p-2 text-ink-200">
            {open ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-800 px-4 py-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-ink-800 text-gold-400' : 'text-ink-300'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mt-2 border-t border-ink-800 pt-2">
            <p className="px-3 text-xs text-ink-400">
              {user?.name}
            </p>
            <button
              onClick={logout}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-leather-300"
            >
              <HiOutlineLogout className="h-5 w-5" /> {t('sidebar.logout')}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
