const API = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function joinWaitlist(email: string): Promise<{ ok: boolean; position: number; status: number }> {
  const res = await fetch(`${API}/api/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  return { ...data, status: res.status };
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const res = await fetch(`${API}/api/waitlist/count`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}
