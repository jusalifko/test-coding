import { Icon } from './icons';

const statuses = ['Semua', 'Hadir', 'Terlambat', 'Izin', 'Alpha'];

export default function FilterBar({ filters, onChange, students, showStudent }) {
  const reset = () => onChange({ query: '', status: 'Semua', date: '', studentId: 'Semua' });
  const hasActiveFilter = filters.query || filters.status !== 'Semua' || filters.date || filters.studentId !== 'Semua';
  return (
    <div className="filter-bar">
      {showStudent && <label className="search-field"><Icon name="search" size={18} /><input value={filters.query} onChange={(event) => onChange({ ...filters, query: event.target.value })} placeholder="Cari nama atau email..." /></label>}
      {showStudent && <label className="select-field"><span className="sr-only">Pilih murid</span><select value={filters.studentId} onChange={(event) => onChange({ ...filters, studentId: event.target.value })}><option value="Semua">Semua murid</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></label>}
      <label className="select-field"><span className="sr-only">Status</span><select value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <label className="date-field"><span className="sr-only">Tanggal</span><input type="date" value={filters.date} onChange={(event) => onChange({ ...filters, date: event.target.value })} /></label>
      {hasActiveFilter && <button className="text-button" type="button" onClick={reset}><Icon name="close" size={15} /> Reset</button>}
    </div>
  );
}
