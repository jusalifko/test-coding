const classByStatus = {
  Hadir: 'success', Terlambat: 'warning', Izin: 'info', Alpha: 'danger',
};

export default function StatusBadge({ status }) {
  return <span className={`status status--${classByStatus[status] || 'neutral'}`}><i />{status || 'Tidak diketahui'}</span>;
}
