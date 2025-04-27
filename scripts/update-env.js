// Version ultra simplifiu00e9e - scripts/update-env.js
// Utilisation de ES modules (type: module dans package.json)
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtenir le chemin du ru00e9pertoire actuel avec ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // Cru00e9er le contenu du fichier .env
  const content = `VITE_SUPABASE_URL=https://cbgdkwkidlzqnmxtadvz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZ2Rrd2tpZGx6cW5teHRhZHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNTAzNDEsImV4cCI6MjA1ODgyNjM0MX0.crwRvaRXFemJSiwzjDbQ36K8xCEuaFfSxQV4GPYD0ZE`;
  
  // Chemin du fichier .env
  const envPath = join(__dirname, '..', '.env');
  
  // u00c9crire dans le fichier .env u00e0 la racine du projet (async)
  await writeFile(envPath, content);
  
  console.log('Fichier .env cru00e9u00e9 avec succu00e8s!');
} catch (error) {
  console.error('Erreur lors de la cru00e9ation du fichier .env:', error);
}
