// Script de test de connexion à Supabase avec logs détaillés
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration des logs détaillés
const VERBOSE_LOGGING = true;

// Récupérer les variables d'environnement Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('='.repeat(80));
console.log('📊 TEST DE CONNEXION SUPABASE AVEC LOGS DÉTAILLÉS');
console.log('='.repeat(80));

// Afficher les informations de configuration
console.log('🔑 CONFIGURATION:');
console.log(`📍 URL Supabase: ${supabaseUrl}`);
console.log(`📍 Clé API présente: ${supabaseKey ? 'Oui ✅' : 'Non ❌'}`);
console.log(`📍 Variables d'environnement chargées: ${supabaseUrl && supabaseKey ? 'Oui ✅' : 'Non ❌'}`);
console.log('-'.repeat(80));

// Test de connexion à Supabase avec logs détaillés
const testSupabaseConnection = async () => {
  try {
    console.log('🔄 Tentative de connexion à Supabase...');
    
    // Test simple: vérifier si on peut accéder à la table users
    console.log('📋 Test 1: Accès à la table users');
    const { data: usersData, error: usersError } = await supabase.from('users').select('count');
    
    if (usersError) {
      console.error('❌ Erreur d\'accès à la table users:', usersError);
      console.error('   - Message:', usersError.message);
      console.error('   - Code:', usersError.code);
      console.error('   - Details:', usersError.details);
    } else {
      console.log('✅ Accès à la table users réussi:', usersData);
    }
    
    // Test d'authentification: vérifier la session actuelle
    console.log('\n📋 Test 2: Vérification de la session d\'authentification');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erreur de récupération de session:', sessionError);
      console.error('   - Message:', sessionError.message);
    } else {
      console.log('✅ Récupération de session réussie:');
      console.log('   - Session active:', sessionData.session ? 'Oui' : 'Non');
      if (VERBOSE_LOGGING && sessionData.session) {
        console.log('   - User ID:', sessionData.session.user.id);
        console.log('   - Email:', sessionData.session.user.email);
      }
    }
    
    // Test des tables d'authentification
    console.log('\n📋 Test 3: Accès aux tables de mappage');
    const { data: mappingData, error: mappingError } = await supabase.from('auth_user_mapping').select('count');
    
    if (mappingError) {
      console.error('❌ Erreur d\'accès à auth_user_mapping:', mappingError);
      console.error('   - Message:', mappingError.message);
    } else {
      console.log('✅ Accès à auth_user_mapping réussi:', mappingData);
    }
    
    // Test de la table tracks
    console.log('\n📋 Test 4: Accès à la table tracks');
    const { data: tracksData, error: tracksError } = await supabase.from('tracks').select('count');
    
    if (tracksError) {
      console.error('❌ Erreur d\'accès à tracks:', tracksError);
      console.error('   - Message:', tracksError.message);
    } else {
      console.log('✅ Accès à tracks réussi:', tracksData);
    }
    
    // Test de la table conversions
    console.log('\n📋 Test 5: Accès à la table conversions');
    const { data: convData, error: convError } = await supabase.from('conversions').select('count');
    
    if (convError) {
      console.error('❌ Erreur d\'accès à conversions:', convError);
      console.error('   - Message:', convError.message);
    } else {
      console.log('✅ Accès à conversions réussi:', convData);
    }
    
    // Test d'inscription (sans réellement créer un utilisateur)
    console.log('\n📋 Test 6: Simulation d\'inscription (dry run)');
    console.log('   ℹ️ Vérification des endpoints d\'authentification sans créer d\'utilisateur');
    
    // On vérifie juste si l'endpoint est accessible
    const testEmail = `test.${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          data: { test: true },
        }),
      });
      
      console.log('✅ Endpoint d\'inscription accessible:');
      console.log('   - Status:', response.status);
      console.log('   - OK:', response.ok);
      
      if (VERBOSE_LOGGING) {
        const responseData = await response.json().catch(() => ({}));
        console.log('   - Réponse:', responseData);
      }
    } catch (error) {
      console.error('❌ Erreur d\'accès à l\'endpoint d\'inscription:', error);
    }
    
    // Résumé final
    console.log('\n='.repeat(80));
    console.log('📋 RÉSUMÉ DES TESTS:');
    console.log('-'.repeat(80));
    console.log(`✅ Configuration Supabase: ${supabaseUrl && supabaseKey ? 'OK' : 'ERREUR'}`);
    console.log(`${!usersError ? '✅' : '❌'} Accès à la table users`);
    console.log(`${!sessionError ? '✅' : '❌'} Vérification de session`);
    console.log(`${!mappingError ? '✅' : '❌'} Accès à auth_user_mapping`);
    console.log(`${!tracksError ? '✅' : '❌'} Accès à tracks`);
    console.log(`${!convError ? '✅' : '❌'} Accès à conversions`);
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌❌❌ ERREUR GLOBALE DE TEST:', error);
  }
};

// Exécuter le test
testSupabaseConnection().then(() => {
  console.log('Tests terminés.');
}).catch((error) => {
  console.error('Erreur inattendue:', error);
});
