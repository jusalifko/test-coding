import { useEffect, useMemo, useState } from 'react';
import { fetchStudents } from './api/users';
import {
  calculateSummary, createAttendanceRecords, createInstructorRecords, filterRecords, formatDate, isPresent,
} from './lib/attendance';
import { Icon } from './components/icons';
import MetricCard from './components/MetricCard';
import ProgressBar from './components/ProgressBar';
import StatusBadge from './components/StatusBadge';
import AttendanceTable from './components/AttendanceTable';
import FilterBar from './components/FilterBar';
import DonutChart from './components/DonutChart';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';

const DEFAULT_FILTERS = { query: '', status: 'Semua', date: '', studentId: 'Semua' };

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('instructor@presencehub.id');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Masukkan alamat email yang valid.');
    if (password.length < 6) return setError('Password minimal terdiri dari 6 karakter.');
    onLogin({ name: 'Nadia Pratama', email });
  };

  return <main className="login-page"><section className="login-aside"><div className="brand"><span className="brand-mark">P</span><span>presence<span>hub</span></span></div><div className="login-aside__content"><p className="eyebrow">INSTRUCTOR PORTAL</p><h1>Hadir untuk setiap<br />progres yang berarti.</h1><p>Pantau ritme belajar kelas dan kehadiranmu dalam satu ruang kerja yang tenang.</p><div className="quote-card"><span>“</span><p>Kehadiran adalah awal dari konsistensi.</p><small>— Presence Hub</small></div></div><div className="aside-orb aside-orb--one"/><div className="aside-orb aside-orb--two"/></section><section className="login-panel"><div className="login-form-wrap"><div className="mobile-brand brand"><span className="brand-mark">P</span><span>presence<span>hub</span></span></div><p className="eyebrow">SELAMAT DATANG KEMBALI</p><h2>Masuk ke ruang kerjamu</h2><p className="muted">Gunakan akun instruktur untuk melanjutkan.</p><form onSubmit={submit} noValidate><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 6 karakter" autoComplete="current-password" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button login-button" type="submit">Masuk <Icon name="arrow" size={18} /></button></form><p className="login-hint">Demo: gunakan email valid dan password minimal 6 karakter.</p></div></section></main>;
}

function PageHeader({ title, description, action }) {
  return <header className="page-header"><div><p className="eyebrow">INSTRUCTOR WORKSPACE</p><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}

function Dashboard({ students, studentRecords, instructorRecords, setPage }) {
  const studentSummary = useMemo(() => calculateSummary(studentRecords), [studentRecords]);
  const instructorSummary = useMemo(() => calculateSummary(instructorRecords), [instructorRecords]);
  const activeStudents = new Set(studentRecords.filter((record) => isPresent(record.status)).map((record) => record.studentId)).size;
  const recentStudents = studentRecords.slice(0, 7);
  const recentInstructor = instructorRecords.slice(0, 5);
  return <>
    <PageHeader title="Selamat pagi, Nadia." description="Ringkasan kehadiran kelasmu hari ini." action={<button className="outline-button" onClick={() => setPage('students')}>Lihat semua riwayat <Icon name="arrow" size={17} /></button>} />
    <section className="metrics-grid"><MetricCard label="Kehadiran murid" value={`${studentSummary.percentage}%`} detail={`${studentSummary.present} dari ${studentSummary.total} check-in`} icon={<Icon name="users" />} /><MetricCard label="Kehadiran personal" value={`${instructorSummary.percentage}%`} detail={`${instructorSummary.present} dari ${instructorSummary.total} hari mengajar`} tone="navy" icon={<Icon name="calendar" />} /><MetricCard label="Murid aktif" value={activeStudents} detail={`dari ${students.length} murid terdaftar`} tone="amber" icon={<Icon name="grid" />} /></section>
    <section className="dashboard-grid"><article className="panel attendance-overview"><div className="panel-heading"><div><h2>Ringkasan kehadiran</h2><p>Periode 28 hari terakhir</p></div><button className="text-button" onClick={() => setPage('students')}>Detail <Icon name="chevron" size={16} /></button></div><div className="overview-content"><DonutChart value={studentSummary.percentage} label="rata-rata murid" /><div className="overview-list"><div><span><i className="legend-dot legend-dot--teal" /> Hadir</span><strong>{studentSummary.present}</strong></div><div><span><i className="legend-dot legend-dot--amber" /> Terlambat</span><strong>{studentSummary.late}</strong></div><div><span><i className="legend-dot legend-dot--blue" /> Izin</span><strong>{studentSummary.permission}</strong></div><div><span><i className="legend-dot legend-dot--red" /> Alpha</span><strong>{studentSummary.absent}</strong></div></div></div></article>
      <article className="panel personal-quick"><div className="panel-heading"><div><h2>Kehadiran personal</h2><p>5 aktivitas terakhir</p></div><button className="text-button" onClick={() => setPage('personal')}>Lihat semua <Icon name="chevron" size={16} /></button></div><div className="quick-list">{recentInstructor.map((record) => <div className="quick-item" key={record.id}><div className="calendar-chip"><b>{new Date(`${record.date}T12:00:00`).getDate()}</b><span>{new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(`${record.date}T12:00:00`))}</span></div><div><strong>{record.note}</strong><small>{record.checkIn}</small></div><StatusBadge status={record.status} /></div>)}</div></article></section>
    <section className="panel recent-panel"><div className="panel-heading"><div><h2>Aktivitas murid terbaru</h2><p>Check-in kelas pada hari-hari terakhir</p></div><button className="text-button" onClick={() => setPage('students')}>Buka riwayat <Icon name="chevron" size={16} /></button></div><AttendanceTable records={recentStudents} type="student" /></section>
  </>;
}

function PersonalPage({ records }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const filtered = useMemo(() => filterRecords(records, filters), [records, filters]);
  const summary = useMemo(() => calculateSummary(filtered), [filtered]);
  return <><PageHeader title="Kehadiran personal" description="Lacak jejak kehadiran dan aktivitas mengajarmu." /><section className="personal-summary"><article className="panel percentage-card"><DonutChart value={summary.percentage} label="kehadiran" tone="navy" /><div><h2>{summary.percentage >= 90 ? 'Konsistensi yang luar biasa!' : 'Mari jaga konsistensinya.'}</h2><p>Dari {summary.total} hari yang ditampilkan, kamu hadir pada {summary.present} hari.</p><ProgressBar value={summary.percentage} tone="navy" /></div></article><article className="panel stat-stack"><div><span>Hadir tepat waktu</span><strong>{summary.present - summary.late}</strong></div><div><span>Terlambat</span><strong>{summary.late}</strong></div><div><span>Izin</span><strong>{summary.permission}</strong></div></article></section><section className="panel history-panel"><div className="panel-heading"><div><h2>Riwayat kehadiran</h2><p>{filtered.length} data ditemukan</p></div></div><FilterBar filters={filters} onChange={setFilters} students={[]} /><AttendanceTable records={filtered} type="instructor" /></section></>;
}

function StudentsPage({ students, records }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const filtered = useMemo(() => filterRecords(records, filters), [records, filters]);
  const summary = useMemo(() => calculateSummary(filtered), [filtered]);
  const studentPerformance = useMemo(() => students.map((student) => {
    const studentRecords = records.filter((record) => record.studentId === student.id);
    return { ...student, ...calculateSummary(studentRecords) };
  }).sort((a, b) => b.percentage - a.percentage).slice(0, 4), [students, records]);
  return <><PageHeader title="Kehadiran murid" description="Pantau total absensi dan konsistensi kehadiran setiap murid." /><section className="metrics-grid metrics-grid--students"><MetricCard label="Total check-in" value={summary.total} detail="pada periode yang ditampilkan" icon={<Icon name="calendar" />} /><MetricCard label="Rata-rata kehadiran" value={`${summary.percentage}%`} detail={`${summary.present} hadir atau terlambat`} tone="navy" icon={<Icon name="grid" />} /><MetricCard label="Perlu perhatian" value={summary.absent} detail="catatan berstatus alpha" tone="rose" icon={<Icon name="users" />} /></section><section className="panel performance-panel"><div className="panel-heading"><div><h2>Performa kehadiran tertinggi</h2><p>Berdasarkan semua riwayat yang dimuat</p></div></div>{studentPerformance.length ? <div className="performance-list">{studentPerformance.map((student, index) => <div className="performance-item" key={student.id}><span className="rank">0{index + 1}</span>{student.image ? <img src={student.image} alt="" /> : <span className="avatar-fallback">{student.name.slice(0, 1)}</span>}<div className="performance-name"><strong>{student.name}</strong><small>{student.present}/{student.total} check-in</small></div><div className="performance-bar"><ProgressBar value={student.percentage} /><span>{student.percentage}%</span></div></div>)}</div> : <EmptyState />}</section><section className="panel history-panel"><div className="panel-heading"><div><h2>Riwayat murid</h2><p>{filtered.length} data ditemukan dari DummyJSON</p></div></div><FilterBar filters={filters} onChange={setFilters} students={students} showStudent /><AttendanceTable records={filtered} type="student" /></section></>;
}

function Sidebar({ page, setPage, instructor, onLogout }) {
  const links = [{ id: 'dashboard', label: 'Overview', icon: 'grid' }, { id: 'personal', label: 'Kehadiran personal', icon: 'calendar' }, { id: 'students', label: 'Kehadiran murid', icon: 'users' }];
  return <aside className="sidebar"><div className="brand"><span className="brand-mark">P</span><span>presence<span>hub</span></span></div><nav>{links.map((link) => <button key={link.id} className={page === link.id ? 'nav-link active' : 'nav-link'} onClick={() => setPage(link.id)}><Icon name={link.icon} size={19} />{link.label}</button>)}</nav><div className="sidebar-bottom"><div className="instructor-card"><span className="instructor-avatar">NP</span><div><strong>{instructor.name}</strong><small>Front-End Instructor</small></div></div><button className="nav-link logout" onClick={onLogout}><Icon name="logout" size={19} />Keluar</button></div></aside>;
}

function AppShell({ instructor, onLogout }) {
  const [page, setPage] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, error: '' });
    fetchStudents(controller.signal).then((data) => {
      if (!data.length) throw new Error('API tidak mengembalikan data murid.');
      setStudents(data);
      setState({ loading: false, error: '' });
    }).catch((error) => {
      if (error.name !== 'AbortError') setState({ loading: false, error: error.message || 'Terjadi kesalahan saat memuat data.' });
    });
    return () => controller.abort();
  }, [refreshKey]);
  const studentRecords = useMemo(() => createAttendanceRecords(students), [students]);
  const instructorRecords = useMemo(() => createInstructorRecords(), []);
  const content = state.loading ? <LoadingState /> : state.error ? <section className="error-state"><strong>Data belum dapat dimuat</strong><p>{state.error}</p><button className="primary-button" onClick={() => setRefreshKey((key) => key + 1)}><Icon name="refresh" size={17} /> Coba lagi</button></section> : page === 'dashboard' ? <Dashboard students={students} studentRecords={studentRecords} instructorRecords={instructorRecords} setPage={setPage} /> : page === 'personal' ? <PersonalPage records={instructorRecords} /> : <StudentsPage students={students} records={studentRecords} />;
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} instructor={instructor} onLogout={onLogout} /><main className="app-main"><div className="mobile-topbar"><button className="brand mobile-brand-button" onClick={() => setPage('dashboard')}><span className="brand-mark">P</span><span>presence<span>hub</span></span></button><button className="mobile-logout" onClick={onLogout}><Icon name="logout" /></button></div>{content}</main></div>;
}

export default function App() {
  const [instructor, setInstructor] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('presencehub-instructor')) || null; } catch { return null; }
  });
  const login = (profile) => { sessionStorage.setItem('presencehub-instructor', JSON.stringify(profile)); setInstructor(profile); };
  const logout = () => { sessionStorage.removeItem('presencehub-instructor'); setInstructor(null); };
  return instructor ? <AppShell instructor={instructor} onLogout={logout} /> : <LoginScreen onLogin={login} />;
}
