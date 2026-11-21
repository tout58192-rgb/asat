import { isSupabaseConfigured, supabase } from '../lib/supabase';

export interface AdminUser {
  id: string;
  email: string | null;
  role: 'admin';
  isDemo?: boolean;
}

const DEMO_SESSION_KEY = 'asatek_demo_admin';

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured || !supabase) {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session?.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== 'admin') {
    await supabase.auth.signOut();
    return null;
  }

  return {
    id: profile.id,
    email: profile.email ?? session.user.email ?? null,
    role: 'admin',
  };
}

export async function signInAdmin(
  email: string,
  password: string,
): Promise<AdminUser> {
  if (!isSupabaseConfigured || !supabase) {
    const demoUser: AdminUser = {
      id: 'demo-admin',
      email: email.trim() || 'admin@asatekpower.pk',
      role: 'admin',
      isDemo: true,
    };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser));
    return demoUser;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error || !data.user) {
    throw new Error(error?.message || 'Invalid email or password');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== 'admin') {
    await supabase.auth.signOut();
    throw new Error('Not authorised');
  }

  return {
    id: profile.id,
    email: profile.email ?? data.user.email ?? null,
    role: 'admin',
  };
}

export async function signOutAdmin(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    localStorage.removeItem(DEMO_SESSION_KEY);
    return;
  }
  await supabase.auth.signOut();
}
