import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import api from '../api/axios';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PRODUCTS, LEAD_SOURCES, LEAD_STATUSES } from '../utils/constants';

const Leads = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', lead_source: '', interested_product: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchLeads = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const { data } = await api.get('/leads', { params });
      setLeads(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || t('leads.loadError'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchLeads(1);
  }, [fetchLeads]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/leads/${deleteTarget.id}`);
      toast.success(t('leads.deleteSuccess'));
      setDeleteTarget(null);
      fetchLeads(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || t('leads.deleteError'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{t('leads.title')}</h1>
          <p className="text-sm text-ink-500">{t('leads.totalCount', { count: pagination.total })}</p>
        </div>
        <Link to="/leads/add" className="btn-primary">
          <HiOutlinePlus className="h-5 w-5" /> {t('leads.addLead')}
        </Link>
      </div>

      {/* Filters */}
      <div className="card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
          <input
            className="input pl-9"
            placeholder={t('leads.searchPlaceholder')}
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <select className="input" name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">{t('leads.allStatuses')}</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{t(`enums.statuses.${s}`)}</option>
          ))}
        </select>
        <select className="input" name="lead_source" value={filters.lead_source} onChange={handleFilterChange}>
          <option value="">{t('leads.allSources')}</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>{t(`enums.sources.${s}`)}</option>
          ))}
        </select>
        <select className="input" name="interested_product" value={filters.interested_product} onChange={handleFilterChange}>
          <option value="">{t('leads.allProducts')}</option>
          {PRODUCTS.map((p) => (
            <option key={p} value={p}>{t(`enums.products.${p}`)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : leads.length === 0 ? (
          <p className="text-sm text-ink-500 py-16 text-center">{t('leads.noResults')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100">
                <tr className="text-left text-ink-500 border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">{t('leads.colName')}</th>
                  <th className="px-5 py-3 font-medium">{t('leads.colPhone')}</th>
                  <th className="px-5 py-3 font-medium">{t('leads.colProduct')}</th>
                  <th className="px-5 py-3 font-medium">{t('leads.colSource')}</th>
                  <th className="px-5 py-3 font-medium">{t('leads.colStatus')}</th>
                  <th className="px-5 py-3 font-medium">{t('leads.colCreated')}</th>
                  <th className="px-5 py-3 font-medium text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-ink-50 last:border-0 hover:bg-cream-100">
                    <td className="px-5 py-3 font-medium text-ink-900">
                      {lead.first_name} {lead.last_name}
                    </td>
                    <td className="px-5 py-3 text-ink-600">{lead.phone}</td>
                    <td className="px-5 py-3 text-ink-600">{t(`enums.products.${lead.interested_product}`)}</td>
                    <td className="px-5 py-3 text-ink-600">{t(`enums.sources.${lead.lead_source}`)}</td>
                    <td className="px-5 py-3"><StatusBadge status={lead.status} label={t(`enums.statuses.${lead.status}`)} /></td>
                    <td className="px-5 py-3 text-ink-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 hover:text-gold-700"
                          title={t('leads.view')}
                        >
                          <HiOutlineEye className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteTarget(lead)}
                            className="p-1.5 rounded-lg text-ink-500 hover:bg-leather-50 hover:text-leather-700"
                            title={t('common.delete')}
                          >
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchLeads(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${
                p === pagination.page ? 'bg-gold-600 text-ink-900' : 'bg-white border border-ink-200 text-ink-600 hover:bg-cream-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('leads.deleteTitle')}
        message={t('leads.deleteMessage', { name: `${deleteTarget?.first_name || ''} ${deleteTarget?.last_name || ''}` })}
        confirmLabel={t('common.delete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Leads;
