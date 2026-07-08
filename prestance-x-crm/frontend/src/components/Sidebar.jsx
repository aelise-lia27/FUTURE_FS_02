import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineLogout,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: t('sidebar.dashboard'), icon: HiOutlineViewGrid },
    { to: '/leads', label: t('sidebar.leads'), icon: HiOutlineUserGroup },
  ];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-ink-900 border-r border-ink-800">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-ink-800">
        <div className="h-9 w-9 rounded-lg bg-gold-600 flex items-center justify-center text-ink-900 font-bold">
          PX
        </div>
        <div>
          <p className="font-semibold text-cream-50 leading-tight">{t('common.appName')}</p>
          <p className="text-xs text-ink-300">{t('common.appTagline')}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ink-800 text-gold-400'
                  : 'text-ink-300 hover:bg-ink-800 hover:text-cream-50'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ink-800 text-gold-400'
                  : 'text-ink-300 hover:bg-ink-800 hover:text-cream-50'
              }`
            }
          >
            <HiOutlineUsers className="h-5 w-5" />
            {t('sidebar.users')}
          </NavLink>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-ink-800 space-y-3">
        <LanguageSwitcher className="!bg-ink-800 !border-ink-700 mx-3" />

        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-9 w-9 rounded-full bg-gold-600/20 text-gold-400 flex items-center justify-center font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-cream-50 truncate">{user?.name}</p>
            <p className="text-xs text-ink-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-leather-900/40 hover:text-leather-300 transition-colors"
        >
          <HiOutlineLogout className="h-5 w-5" />
          {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
