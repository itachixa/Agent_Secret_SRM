export async function getCurrentUser(userId?: string) {
  if (!userId) return { data: null, error: null };
  return { data: { user: { id: userId } }, error: null };
}

export async function getSession() {
  return { data: { session: null }, error: null };
}
