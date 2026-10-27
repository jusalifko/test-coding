export default function EmptyState({ title = 'Belum ada data', description = 'Coba ubah filter atau muat ulang data.' }) {
  return <div className="empty-state"><div className="empty-state__mark">∅</div><strong>{title}</strong><p>{description}</p></div>;
}
