import { useState } from 'react';
import { PRODUCTS, LEAD_SOURCES, LEAD_STATUSES } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import Loader from './Loader';

const emptyLead = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  city: '',
  interested_product: PRODUCTS[0],
  message: '',
  lead_source: LEAD_SOURCES[0],
  status: LEAD_STATUSES[0],
};

const LeadForm = ({ initialData, onSubmit, submitting, submitLabel }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ ...emptyLead, ...initialData });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = t('leadForm.errFirstName');
    if (!form.last_name.trim()) newErrors.last_name = t('leadForm.errLastName');
    if (!form.phone.trim()) newErrors.phone = t('leadForm.errPhone');
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = t('leadForm.errEmail');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">{t('leadForm.firstName')} *</label>
          <input name="first_name" className="input" value={form.first_name} onChange={handleChange} />
          {errors.first_name && <p className="text-xs text-leather-700 mt-1">{errors.first_name}</p>}
        </div>
        <div>
          <label className="label">{t('leadForm.lastName')} *</label>
          <input name="last_name" className="input" value={form.last_name} onChange={handleChange} />
          {errors.last_name && <p className="text-xs text-leather-700 mt-1">{errors.last_name}</p>}
        </div>
        <div>
          <label className="label">{t('leadForm.phone')} *</label>
          <input name="phone" className="input" value={form.phone} onChange={handleChange} placeholder="+228 90 00 00 00" />
          {errors.phone && <p className="text-xs text-leather-700 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="label">{t('leadForm.email')}</label>
          <input name="email" type="email" className="input" value={form.email || ''} onChange={handleChange} />
          {errors.email && <p className="text-xs text-leather-700 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="label">{t('leadForm.city')}</label>
          <input name="city" className="input" value={form.city || ''} onChange={handleChange} />
        </div>
        <div>
          <label className="label">{t('leadForm.interestedProduct')} *</label>
          <select name="interested_product" className="input" value={form.interested_product} onChange={handleChange}>
            {PRODUCTS.map((p) => (
              <option key={p} value={p}>{t(`enums.products.${p}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t('leadForm.leadSource')}</label>
          <select name="lead_source" className="input" value={form.lead_source} onChange={handleChange}>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>{t(`enums.sources.${s}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t('leadForm.status')}</label>
          <select name="status" className="input" value={form.status} onChange={handleChange}>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{t(`enums.statuses.${s}`)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">{t('leadForm.message')}</label>
        <textarea
          name="message"
          rows={4}
          className="input resize-none"
          value={form.message || ''}
          onChange={handleChange}
          placeholder={t('leadForm.messagePlaceholder')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary min-w-[120px]">
          {submitting ? <Loader size="sm" className="border-ink-900 border-t-transparent" /> : (submitLabel || t('leadForm.saveLead'))}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
