// scripts/test-db-simple.js
// Un script simple pour tester la connexion à la base de données PostgreSQL

import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de pg-promise
const pgp = pgPromise();

// Configuration de la connexion
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'flowymusic',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
};



// Création de l'instance de base de données
const db = pgp(config);

// Fonction pour tester la connexion
async function testConnection() {
  try {
    await db.any('SELECT 1');
    console.log('✅ Connexion à la base de données établie avec succès.');
    return true;
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error);
    return false;
  }
}

// Exécution du test
(async () => {
  try {
    const success = await testConnection();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Erreur lors du test de connexion:', error);
    process.exit(1);
  }
})();
