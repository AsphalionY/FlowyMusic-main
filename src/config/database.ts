import * as pgPromiseModule from 'pg-promise';
import * as dotenv from 'dotenv';

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de pg-promise
// @ts-ignore - Contourner les problèmes de types avec pg-promise
const pgp = pgPromiseModule();
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'flowymusic',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
};

// Création de l'instance de base de données
export const db = pgp(config);

// Fonction pour tester la connexion
export const testConnection = async (): Promise<boolean> => {
  try {
    await db.any('SELECT 1');
    console.log('✅ Connexion à la base de données établie avec succès.');
    return true;
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error);
    return false;
  }
};
