import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import { formatDate } from '../lib/attendance';

export default function AttendanceTable({ records, type, limit }) {
  const shownRecords = limit ? records.slice(0, limit) : records;
  if (!shownRecords.length) return <EmptyState title="Tidak ada riwayat yang cocok" description="Ubah filter untuk melihat data kehadiran lainnya." />;

  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{type === 'student' && <th>Murid</th>}<th>Tanggal</th><th>Status</th><th>Check-in</th>{type === 'instructor' && <th>Catatan</th>}</tr></thead>
        <tbody>{shownRecords.map((record) => (
          <tr key={record.id}>
            {type === 'student' && <td><div className="person-cell">{record.studentImage ? <img src={record.studentImage} alt="" /> : <span className="avatar-fallback">{record.studentName?.slice(0, 1)}</span>}<div><strong>{record.studentName}</strong><small>{record.cohort}</small></div></div></td>}
            <td>{formatDate(record.date)}</td><td><StatusBadge status={record.status} /></td><td>{record.checkIn}</td>{type === 'instructor' && <td className="note-cell">{record.note}</td>}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
