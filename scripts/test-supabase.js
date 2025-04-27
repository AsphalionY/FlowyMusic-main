// scripts/test-supabase.js
// Script simple pour tester la connexion u00e0 Supabase
// Version ESM (compatible avec type: module dans package.json)

// Chargement des variables d'environnement
import 'dotenv/config';

// Import de la librairie Supabase
import { createClient } from '@supabase/supabase-js';

// Affichage des informations de du00e9bogage
console.log('URL Supabase:', process.env.VITE_SUPABASE_URL);
console.log('Clu00e9 Supabase disponible:', process.env.VITE_SUPABASE_ANON_KEY ? 'Oui' : 'Non');

// Cru00e9ation du client Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\u274C Erreur: Variables d\'environnement Supabase manquantes.');
  console.log('Veuillez du00e9finir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction de test de connexion
async function testConnection() {
  try {
    // Test simple pour vu00e9rifier si on peut se connecter u00e0 Supabase
    const { data, error } = await supabase.from('users').select('count');
    
    if (error) {
      console.error('\u274C Erreur de connexion u00e0 Supabase:', error.message);
      
      if (error.message.includes('relation "users" does not exist')) {
        console.log('\u2139\uFE0F La table "users" n\'existe pas encore dans votre projet Supabase.');
        console.log('Vous devez cru00e9er cette table avant de pouvoir vous connecter.');
      }
      
      return false;
    }
    
    console.log('\u2705 Connexion u00e0 Supabase u00e9tablie avec succu00e8s !', data);
    return true;
  } catch (error) {
    console.error('\u274C Erreur lors du test de connexion u00e0 Supabase:', error);
    return false;
  }
}

// Exu00e9cuter le test
testConnection()
  .then(success => {
    if (success) {
      console.log('\u2705 Test de connexion ru00e9ussi.');
    } else {
      console.log('\u274C Test de connexion u00e9chouu00e9.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\u274C Erreur inattendue:', error);
    process.exit(1);
  });
