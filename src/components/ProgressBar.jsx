export default function ProgressBar({ value, tone = 'teal' }) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return <div className={`progress progress--${tone}`} aria-label={`${safeValue}% kehadiran`}><span style={{ width: `${safeValue}%` }} /></div>;
}
