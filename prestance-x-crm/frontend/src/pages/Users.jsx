import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineKey } from 'react-icons/hi';
import api from '../api/axios';
import Loader from '../components/Loader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const emptyForm = { name: '', email: '', password: '', role: 'commercial' };

const UserModal = ({ open, onClose, onSaved, editingUser }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      setForm({ name: editingUser.name, email: editingUser.email, password: '', role: editingUser.role });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingUser, open]);

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t('users.errName');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = t('users.errEmail');
    if (!editingUser && form.password.length < 6) newErrors.password = t('users.errPassword');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, { name: form.name, email: form.email, role: form.role });
        toast.success(t('users.updatedSuccess'));
      } else {
        await api.post('/users', form);
        toast.success(t('users.createdSuccess'));
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || t('users.saveError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-ink-900 mb-4">
          {editingUser ? t('users.editUser') : t('users.addNewUser')}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">{t('users.fullName')}</label>
            <input name="name" className="input" value={form.name} onChange={handleChange} />
            {errors.name && <p className="text-xs text-leather-700 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label">{t('users.colEmail')}</label>
            <input name="email" type="email" className="input" value={form.email} onChange={handleChange} />
            {errors.email && <p className="text-xs text-leather-700 mt-1">{errors.email}</p>}
          </div>
          {!editingUser && (
            <div>
              <label className="label">{t('users.password')}</label>
              <input name="password" type="password" className="input" value={form.password} onChange={handleChange} />
              {errors.password && <p className="text-xs text-leather-700 mt-1">{errors.password}</p>}
            </div>
          )}
          <div>
            <label className="label">{t('users.role')}</label>
            <select name="role" className="input" value={form.role} onChange={handleChange}>
              <option value="commercial">{t('users.roleCommercial')}</option>
              <option value="admin">{t('users.roleAdmin')}</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
            <button type="submit" disabled={submitting} className="btn-primary min-w-[100px]">
              {submitting ? <Loader size="sm" className="border-ink-900 border-t-transparent" /> : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Users = () => {
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || t('users.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      toast.success(t('users.deleteSuccess'));
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || t('users.deleteError'));
    }
  };

  const handleToggleActive = async (u) => {
    try {
      await api.put(`/users/${u.id}`, { name: u.name, email: u.email, role: u.role, is_active: u.is_active ? 0 : 1 });
      toast.success(t('users.toggleSuccess', { action: u.is_active ? t('users.deactivated') : t('users.activated') }));
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || t('users.toggleError'));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(t('users.errPassword'));
      return;
    }
    try {
      await api.put(`/users/${resetTarget.id}/password`, { password: newPassword });
      toast.success(t('users.passwordResetSuccess'));
      setResetTarget(null);
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || t('users.passwordResetError'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{t('users.title')}</h1>
          <p className="text-sm text-ink-500">{t('users.subtitle')}</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingUser(null); setModalOpen(true); }}>
          <HiOutlinePlus className="h-5 w-5" /> {t('users.addUser')}
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100">
                <tr className="text-left text-ink-500 border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">{t('users.colName')}</th>
                  <th className="px-5 py-3 font-medium">{t('users.colEmail')}</th>
                  <th className="px-5 py-3 font-medium">{t('users.colRole')}</th>
                  <th className="px-5 py-3 font-medium">{t('users.colStatus')}</th>
                  <th className="px-5 py-3 font-medium text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-ink-50 last:border-0 hover:bg-cream-100">
                    <td className="px-5 py-3 font-medium text-ink-900">
                      {u.name} {u.id === currentUser.id && <span className="text-xs text-ink-400">{t('common.you')}</span>}
                    </td>
                    <td className="px-5 py-3 text-ink-600">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-gold-100 text-gold-800' : 'bg-ink-100 text-ink-700'}`}>
                        {u.role === 'admin' ? t('users.roleAdmin') : t('users.roleCommercial')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={u.id === currentUser.id}
                        className={`badge ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-ink-100 text-ink-500'} disabled:cursor-not-allowed`}
                      >
                        {u.is_active ? t('users.active') : t('users.inactive')}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingUser(u); setModalOpen(true); }}
                          className="p-1.5 rounded-lg text-ink-500 hover:bg-cream-100 hover:text-gold-700"
                          title={t('common.edit')}
                        >
                          <HiOutlinePencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setResetTarget(u)}
                          className="p-1.5 rounded-lg text-ink-500 hover:bg-cream-100 hover:text-gold-700"
                          title={t('users.resetPassword')}
                        >
                          <HiOutlineKey className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          disabled={u.id === currentUser.id}
                          className="p-1.5 rounded-lg text-ink-500 hover:bg-leather-50 hover:text-leather-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          title={t('common.delete')}
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchUsers}
        editingUser={editingUser}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('users.deleteTitle')}
        message={t('users.deleteMessage', { name: deleteTarget?.name })}
        confirmLabel={t('common.delete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">{t('users.resetPasswordFor', { name: resetTarget.name })}</h3>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="label">{t('users.newPassword')}</label>
                <input
                  type="password"
                  className="input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('users.atLeast6')}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn-secondary" onClick={() => { setResetTarget(null); setNewPassword(''); }}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn-primary">{t('users.resetPassword')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
