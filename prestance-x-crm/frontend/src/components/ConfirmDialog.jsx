import { useLanguage } from '../context/LanguageContext';

const ConfirmDialog = ({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger = true }) => {
  const { t } = useLanguage();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
        <p className="mt-2 text-sm text-ink-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>
            {cancelLabel || t('common.cancel')}
          </button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
            {confirmLabel || t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
