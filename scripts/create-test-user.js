// scripts/create-test-user.js
// Approche entièrement CommonJS pour Node.js

// Chargement des variables d'environnement
require('dotenv').config();

// Initialisation de pg-promise
const pgp = require('pg-promise')();

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

const createTestUser = async () => {
  try {
    // Vu00e9rifier si l'utilisateur existe du00e9ju00e0
    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE username = $1', ['testuser']);
    
    if (existingUser) {
      console.log('\u26A0uFE0F L\'utilisateur "testuser" existe du00e9ju00e0 avec l\'ID:', existingUser.id);
      return existingUser.id;
    }
    
    // Cru00e9er un nouvel utilisateur
    const result = await db.one(
      `INSERT INTO users 
        (username, email, password_hash, profile_image_url, bio, created_at, updated_at) 
      VALUES 
        ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
      RETURNING id`,
      ['testuser', 'test@example.com', 'hashed_password', null, 'Utilisateur de test']
    );
    
    console.log('\u2705 Utilisateur cru00e9u00e9 avec succu00e8s ! ID:', result.id);
    return result.id;
  } catch (error) {
    console.error('\u274C Erreur lors de la cru00e9ation de l\'utilisateur:', error);
    throw error;
  }
};

// Exu00e9cuter la fonction
createTestUser()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
