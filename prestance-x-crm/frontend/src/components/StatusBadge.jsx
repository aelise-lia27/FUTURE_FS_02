const STATUS_STYLES = {
  New: 'bg-gold-100 text-gold-800',
  Contacted: 'bg-leather-100 text-leather-700',
  Converted: 'bg-emerald-100 text-emerald-700',
};

const StatusBadge = ({ status, label }) => {
  return (
    <span className={`badge ${STATUS_STYLES[status] || 'bg-ink-100 text-ink-700'}`}>
      {label || status}
    </span>
  );
};

export default StatusBadge;
