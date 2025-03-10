
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

const supabaseUrl = process.env.SUPABASEURL|| '';
const supabaseKey = process.env.SUPABASEKEY|| '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
