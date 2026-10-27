const USERS_ENDPOINT = 'https://dummyjson.com/users?limit=100&select=id,firstName,lastName,email,image,department';

/**
 * Fetches students from DummyJSON and normalizes only the fields used by the UI.
 * Keeping boundary validation here prevents API shape assumptions in components.
 */
export async function fetchStudents(signal) {
  const response = await fetch(USERS_ENDPOINT, { signal });

  if (!response.ok) {
    throw new Error(`Tidak dapat mengambil data murid (HTTP ${response.status}).`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload?.users)) {
    throw new Error('Data murid dari API tidak valid.');
  }

  return payload.users
    .filter((user) => Number.isFinite(user?.id) && user?.firstName && user?.lastName)
    .map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email || '—',
      image: user.image || '',
      cohort: user.department || 'General',
    }));
}
