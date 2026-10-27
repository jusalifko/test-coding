const DAY = 86_400_000;
const STATUS = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Terlambat', 'Izin', 'Alpha'];

const pad = (value) => String(value).padStart(2, '0');

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDate(dateKey) {
  const date = new Date(`${dateKey}T12:00:00`);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).format(date);
}

function deterministicIndex(seed, dateIndex) {
  return (seed * 17 + dateIndex * 29 + seed * dateIndex * 3) % STATUS.length;
}

function timeFor(status, seed, index) {
  if (status === 'Izin' || status === 'Alpha') return '—';
  const minute = status === 'Terlambat' ? 8 + ((seed + index) % 20) : (seed + index * 3) % 8;
  return `08:${pad(minute)}`;
}

/** Generates reproducible local attendance records to complement DummyJSON students. */
export function createAttendanceRecords(students, days = 28) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const records = [];

  students.forEach((student, studentIndex) => {
    for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
      const date = new Date(today.getTime() - dayIndex * DAY);
      // Exclude Sunday from teaching records.
      if (date.getDay() === 0) continue;
      const status = STATUS[deterministicIndex(student.id + studentIndex, dayIndex)];
      records.push({
        id: `${student.id}-${toDateKey(date)}`,
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        studentImage: student.image,
        cohort: student.cohort,
        date: toDateKey(date),
        status,
        checkIn: timeFor(status, student.id, dayIndex),
      });
    }
  });

  return records.sort((a, b) => b.date.localeCompare(a.date) || a.studentName.localeCompare(b.studentName));
}

export function createInstructorRecords(days = 28) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getTime() - index * DAY);
    if (date.getDay() === 0) return null;
    const statuses = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Terlambat', 'Izin'];
    const status = statuses[(index * 5 + 1) % statuses.length];
    return {
      id: `instructor-${toDateKey(date)}`,
      date: toDateKey(date),
      status,
      checkIn: status === 'Izin' ? '—' : status === 'Terlambat' ? '08:14' : `07:${pad(48 + (index % 10))}`,
      note: status === 'Izin' ? 'Izin urusan keluarga' : status === 'Terlambat' ? 'Briefing kelas sebelumnya' : 'Mengajar kelas Front-End',
    };
  }).filter(Boolean);
}

export function isPresent(status) {
  return status === 'Hadir' || status === 'Terlambat';
}

export function calculateSummary(records) {
  const total = records.length;
  const present = records.filter((record) => isPresent(record.status)).length;
  const late = records.filter((record) => record.status === 'Terlambat').length;
  const permission = records.filter((record) => record.status === 'Izin').length;
  const absent = records.filter((record) => record.status === 'Alpha').length;
  return {
    total, present, late, permission, absent,
    percentage: total ? Math.round((present / total) * 100) : 0,
  };
}

export function filterRecords(records, { query = '', status = 'Semua', date = '', studentId = 'Semua' }) {
  const normalizedQuery = query.trim().toLowerCase();
  return records.filter((record) => {
    const matchesQuery = !normalizedQuery
      || record.studentName?.toLowerCase().includes(normalizedQuery)
      || record.studentEmail?.toLowerCase().includes(normalizedQuery);
    const matchesStatus = status === 'Semua' || record.status === status;
    const matchesDate = !date || record.date === date;
    const matchesStudent = studentId === 'Semua' || String(record.studentId) === String(studentId);
    return matchesQuery && matchesStatus && matchesDate && matchesStudent;
  });
}
