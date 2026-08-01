import { createClient } from '@supabase/supabase-js';
import { initialProducts } from '../data/products';

const supabaseUrl = 'https://hbirmyindensklmczjxb.supabase.co';
const supabaseKey = 'sb_publishable_Uwjacy06vZpnuWk_83nWoQ_ZlP3HOkj';
const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log('Total productos a sincronizar:', initialProducts.length);
  const { data, error } = await supabase.from('products').upsert(initialProducts);
  if (error) {
    console.error('Error al insertar en Supabase:', error);
  } else {
    console.log('¡Todos los productos se sincronizaron con éxito en la base de datos Supabase!');
  }
}

sync();
