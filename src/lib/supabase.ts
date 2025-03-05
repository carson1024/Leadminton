import { createClient } from '@supabase/supabase-js';

// Dummy implementation for local development
// export const supabase = {
//   auth: {
//     getSession: () => Promise.resolve({ data: { session: null }, error: null }),
//     getUser: () => Promise.resolve({ data: { user: null }, error: null }),
//     onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
//     signInWithPassword: () => Promise.resolve({ data: null, error: null }),
//     signUp: () => Promise.resolve({ data: null, error: null }),
//     signOut: () => Promise.resolve({ error: null })
//   }
// };

// export async function initializeSupabase(): Promise<boolean> {
//   return true;
// }

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL as string, import.meta.env.VITE_SUPABASE_KEY as string);