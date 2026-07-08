import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import api from '../api/axios';
import LeadForm from '../components/LeadForm';
import Loader from '../components/Loader';
import { useLanguage } from '../context/LanguageContext';

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await api.get(`/leads/${id}`);
        setLead(data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || t('editLead.loadError'));
        navigate('/leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await api.put(`/leads/${id}`, formData);
      toast.success(t('editLead.success'));
      navigate(`/leads/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || t('editLead.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link to={`/leads/${id}`} className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
          <HiOutlineArrowLeft className="h-4 w-4" /> {t('editLead.back')}
        </Link>
        <h1 className="text-2xl font-bold text-ink-900 mt-2">{t('editLead.title')}</h1>
        <p className="text-sm text-ink-500">{t('editLead.subtitle', { name: `${lead.first_name} ${lead.last_name}` })}</p>
      </div>

      <LeadForm initialData={lead} onSubmit={handleSubmit} submitting={submitting} submitLabel={t('leadForm.saveChanges')} />
    </div>
  );
};

export default EditLead;
