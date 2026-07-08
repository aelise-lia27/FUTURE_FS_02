import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import api from '../api/axios';
import LeadForm from '../components/LeadForm';
import { useLanguage } from '../context/LanguageContext';

const AddLead = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/leads', formData);
      toast.success(t('addLead.success'));
      navigate(`/leads/${data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || t('addLead.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link to="/leads" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-800">
          <HiOutlineArrowLeft className="h-4 w-4" /> {t('addLead.back')}
        </Link>
        <h1 className="text-2xl font-bold text-ink-900 mt-2">{t('addLead.title')}</h1>
        <p className="text-sm text-ink-500">{t('addLead.subtitle')}</p>
      </div>

      <LeadForm onSubmit={handleSubmit} submitting={submitting} submitLabel={t('leadForm.createLead')} />
    </div>
  );
};

export default AddLead;
