import { createClient } from '@supabase/supabase-js';

// Variables d'environnement pour Supabase
// Ces valeurs doivent être définies dans votre fichier .env
// Utilisation d'une approche compatible avec tous les environnements
interface WindowWithEnv extends Window {
  ENV?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
  }
}

// Récupération des variables d'environnement
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

// Afficher un warning si les variables ne sont pas définies
if (!supabaseUrl || !supabaseKey) {
  console.warn('Variables d\'environnement Supabase manquantes ou vides.', {
    url: supabaseUrl ? 'définie' : 'manquante',
    key: supabaseKey ? 'définie' : 'manquante',
    urlValue: supabaseUrl === '%VITE_SUPABASE_URL%' ? 'non remplacée' : 'ok',
    keyValue: supabaseKey === '%VITE_SUPABASE_ANON_KEY%' ? 'non remplacée' : 'ok'
  });
}

// Création du client Supabase avec gestion d'erreurs
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',  // URL par défaut pour éviter les erreurs
  supabaseKey || 'placeholder-key-000000000000000000000' // Clé par défaut pour éviter les erreurs
);

// Fonction de test de connexion à Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Vérification des variables avant de tenter la connexion
    if (!supabaseUrl || supabaseUrl === '%VITE_SUPABASE_URL%' || 
        !supabaseKey || supabaseKey === '%VITE_SUPABASE_ANON_KEY%') {
      console.error('❌ Impossible de tester la connexion: variables d\'environnement non définies');
      return false;
    }
    
    const { error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error('❌ Erreur de connexion à Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Connexion à Supabase établie avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion à Supabase:', error);
    return false;
  }
};
