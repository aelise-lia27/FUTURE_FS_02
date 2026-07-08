import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlinePhone,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import api from '../api/axios';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-sm text-ink-500">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || t('dashboard.statsError'));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">
          {t('dashboard.welcome', { name: user?.name?.split(' ')[0] })}
        </h1>
        <p className="text-sm text-ink-500">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineUserGroup} label={t('dashboard.totalLeads')} value={stats?.total ?? 0} color="bg-gold-100 text-gold-700" />
        <StatCard icon={HiOutlineSparkles} label={t('dashboard.newLeads')} value={stats?.new ?? 0} color="bg-ink-100 text-ink-700" />
        <StatCard icon={HiOutlinePhone} label={t('dashboard.contacted')} value={stats?.contacted ?? 0} color="bg-leather-100 text-leather-700" />
        <StatCard icon={HiOutlineCheckCircle} label={t('dashboard.converted')} value={stats?.converted ?? 0} color="bg-emerald-100 text-emerald-700" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink-900">{t('dashboard.recentLeads')}</h2>
          <Link to="/leads" className="text-sm font-medium text-gold-700 hover:text-gold-800">
            {t('dashboard.viewAll')}
          </Link>
        </div>

        {stats?.recentLeads?.length === 0 ? (
          <p className="text-sm text-ink-500 py-8 text-center">{t('dashboard.noLeads')}</p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500 border-b border-ink-100">
                  <th className="px-5 py-2 font-medium">{t('dashboard.colName')}</th>
                  <th className="px-5 py-2 font-medium">{t('dashboard.colPhone')}</th>
                  <th className="px-5 py-2 font-medium">{t('dashboard.colProduct')}</th>
                  <th className="px-5 py-2 font-medium">{t('dashboard.colSource')}</th>
                  <th className="px-5 py-2 font-medium">{t('dashboard.colStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentLeads?.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-ink-50 last:border-0 hover:bg-cream-100 cursor-pointer"
                    onClick={() => (window.location.href = `/leads/${lead.id}`)}
                  >
                    <td className="px-5 py-3 font-medium text-ink-900">
                      {lead.first_name} {lead.last_name}
                    </td>
                    <td className="px-5 py-3 text-ink-600">{lead.phone}</td>
                    <td className="px-5 py-3 text-ink-600">{t(`enums.products.${lead.interested_product}`)}</td>
                    <td className="px-5 py-3 text-ink-600">{t(`enums.sources.${lead.lead_source}`)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={lead.status} label={t(`enums.statuses.${lead.status}`)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
