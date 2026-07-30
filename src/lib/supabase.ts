import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hbirmyindensklmczjxb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Uwjacy06vZpnuWk_83nWoQ_ZlP3HOkj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
