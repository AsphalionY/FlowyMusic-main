import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Charge les variables d'environnement
dotenv.config();

// Import des routes API
import { backendAPI } from './api';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Point d'entrée API principale
app.use('/api', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.path}`);
  next();
});

// Routes API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes pour la musique
app.get('/api/music/public', async (req, res) => {
  try {
    const tracks = await backendAPI.music.getPublicMusic();
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching public music:', error);
    res.status(500).json({ error: 'Failed to fetch public music' });
  }
});

app.get('/api/music/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tracks = await backendAPI.music.getUserMusic(userId);
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching user music:', error);
    res.status(500).json({ error: 'Failed to fetch user music' });
  }
});

// En production, sers les fichiers statiques du frontend
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📁 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 http://localhost:${PORT}`);
});
