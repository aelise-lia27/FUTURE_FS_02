import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineTrash, HiOutlinePaperAirplane } from 'react-icons/hi';
import api from '../api/axios';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LEAD_STATUSES } from '../utils/constants';

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-ink-400 font-medium">{label}</p>
    <p className="text-sm text-ink-900 mt-0.5">{value || '—'}</p>
  </div>
);

const LeadDetails = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const fetchLead = async () => {
    try {
      const { data } = await api.get(`/leads/${id}`);
      setLead(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || t('leadDetails.loadError'));
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    setStatusUpdating(true);
    try {
      await api.patch(`/leads/${id}/status`, { status });
      setLead((prev) => ({ ...prev, status }));
      toast.success(t('leadDetails.statusUpdated'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('leadDetails.statusUpdateError'));
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setAddingNote(true);
    try {
      const { data } = await api.post(`/leads/${id}/notes`, { content: noteContent });
      setLead((prev) => ({ ...prev, notes: [data.data, ...(prev.notes || [])] }));
      setNoteContent('');
      toast.success(t('leadDetails.noteAdded'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('leadDetails.noteError'));
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteLead = async () => {
    try {
      await api.delete(`/leads/${id}`);
      toast.success(t('leadDetails.deleteSuccess'));
      navigate('/leads');
    } catch (err) {
      toast.error(err.response?.data?.message || t('leadDetails.deleteError'));
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link to="/leads" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
          <HiOutlineArrowLeft className="h-4 w-4" /> {t('leadDetails.back')}
        </Link>
        <div className="flex items-center gap-2">
          <Link to={`/leads/${id}/edit`} className="btn-secondary">
            <HiOutlinePencil className="h-4 w-4" /> {t('leadDetails.edit')}
          </Link>
          {isAdmin && (
            <button onClick={() => setDeleteDialog(true)} className="btn-danger">
              <HiOutlineTrash className="h-4 w-4" /> {t('leadDetails.delete')}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">
              {lead.first_name} {lead.last_name}
            </h1>
            <p className="text-sm text-ink-500">
              {t('leadDetails.leadNumber', { id: lead.id })} &middot; {t('leadDetails.createdOn', { date: new Date(lead.created_at).toLocaleString() })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={lead.status} label={t(`enums.statuses.${lead.status}`)} />
            <select
              className="input !w-auto"
              value={lead.status}
              onChange={handleStatusChange}
              disabled={statusUpdating}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{t(`enums.statuses.${s}`)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
          <InfoRow label={t('leadDetails.phone')} value={lead.phone} />
          <InfoRow label={t('leadDetails.email')} value={lead.email} />
          <InfoRow label={t('leadDetails.city')} value={lead.city} />
          <InfoRow label={t('leadDetails.interestedProduct')} value={t(`enums.products.${lead.interested_product}`)} />
          <InfoRow label={t('leadDetails.leadSource')} value={t(`enums.sources.${lead.lead_source}`)} />
          <InfoRow label={t('leadDetails.assignedTo')} value={lead.assigned_to_name} />
          <InfoRow label={t('leadDetails.createdBy')} value={lead.created_by_name} />
          <InfoRow label={t('leadDetails.lastUpdated')} value={new Date(lead.updated_at).toLocaleString()} />
        </div>

        {lead.message && (
          <div className="mt-6 pt-6 border-t border-ink-100">
            <p className="text-xs uppercase tracking-wide text-ink-400 font-medium mb-1">{t('leadDetails.message')}</p>
            <p className="text-sm text-ink-700 whitespace-pre-wrap">{lead.message}</p>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="card">
        <h2 className="font-semibold text-ink-900 mb-4">{t('leadDetails.notesTitle')}</h2>

        <form onSubmit={handleAddNote} className="flex items-start gap-3 mb-6">
          <textarea
            rows={2}
            className="input resize-none flex-1"
            placeholder={t('leadDetails.notePlaceholder')}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
          <button type="submit" disabled={addingNote || !noteContent.trim()} className="btn-primary h-fit">
            {addingNote ? <Loader size="sm" className="border-ink-900 border-t-transparent" /> : <HiOutlinePaperAirplane className="h-4 w-4 rotate-90" />}
          </button>
        </form>

        {lead.notes?.length === 0 ? (
          <p className="text-sm text-ink-500 text-center py-6">{t('leadDetails.noNotes')}</p>
        ) : (
          <div className="space-y-4">
            {lead.notes?.map((note) => (
              <div key={note.id} className="flex gap-3 border-b border-ink-50 last:border-0 pb-4 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center text-xs font-semibold shrink-0">
                  {note.author_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-ink-900">{note.author_name || t('common.unknown')}</p>
                    <p className="text-xs text-ink-400">{new Date(note.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-ink-700 mt-1 whitespace-pre-wrap">{note.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialog}
        title={t('leadDetails.deleteTitle')}
        message={t('leadDetails.deleteMessage', { name: `${lead.first_name} ${lead.last_name}` })}
        confirmLabel={t('common.delete')}
        onConfirm={handleDeleteLead}
        onCancel={() => setDeleteDialog(false)}
      />
    </div>
  );
};

export default LeadDetails;
