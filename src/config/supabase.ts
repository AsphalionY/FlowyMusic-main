import { createClient } from '@supabase/supabase-js';

// Variables d'environnement pour Supabase
// Ces valeurs doivent u00eatre du00e9finies dans votre fichier .env
// Utilisation d'une approche compatible avec tous les environnements
interface WindowWithEnv extends Window {
  ENV?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
  }
}

// Ru00e9cupu00e9ration des variables d'environnement
const getEnv = (key: string): string => {
  // 1. Essayer window.ENV (pour l'environnement browser)
  if (typeof window !== 'undefined' && (window as WindowWithEnv).ENV) {
    // Simplement accéder aux propriétés connues
    if (key === 'VITE_SUPABASE_URL') {
      return (window as WindowWithEnv).ENV?.VITE_SUPABASE_URL || '';
    }
    if (key === 'VITE_SUPABASE_ANON_KEY') {
      return (window as WindowWithEnv).ENV?.VITE_SUPABASE_ANON_KEY || '';
    }
  }
  
  // 2. Essayer process.env (pour l'environnement Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  
  return '';
};

export const supabaseUrl = getEnv('VITE_SUPABASE_URL');
export const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Cru00e9ation du client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction de test de connexion u00e0 Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error('\u274C Erreur de connexion u00e0 Supabase:', error.message);
      return false;
    }
    
    console.log('\u2705 Connexion u00e0 Supabase u00e9tablie avec succu00e8s');
    return true;
  } catch (error) {
    console.error('\u274C Erreur lors du test de connexion u00e0 Supabase:', error);
    return false;
  }
};
