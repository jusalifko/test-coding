export default function DonutChart({ value, label, tone = 'teal' }) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return <div className={`donut donut--${tone}`} style={{ '--value': safeValue }}><div><strong>{safeValue}%</strong><span>{label}</span></div></div>;
}
