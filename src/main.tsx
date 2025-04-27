import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Définition de l'interface pour window.ENV
interface WindowWithEnv extends Window {
  ENV?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
  }
}

// Fonction de rendu avec gestion des erreurs
function renderApp() {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error("L'élément root n'a pas été trouvé dans le DOM");
    }
    
    // Vérification des variables d'environnement Supabase
    const checkEnvVars = () => {
      if (typeof window !== 'undefined' && (window as WindowWithEnv).ENV) {
        const env = (window as WindowWithEnv).ENV;
        const supabaseUrl = env?.VITE_SUPABASE_URL;
        const supabaseKey = env?.VITE_SUPABASE_ANON_KEY;
        
        // Afficher des avertissements si les variables sont vides
        if (!supabaseUrl || supabaseUrl === '%VITE_SUPABASE_URL%') {
          console.warn('⚠️ VITE_SUPABASE_URL est manquante ou non remplacée');
        }
        
        if (!supabaseKey || supabaseKey === '%VITE_SUPABASE_ANON_KEY%') {
          console.warn('⚠️ VITE_SUPABASE_ANON_KEY est manquante ou non remplacée');
        }
      }
    };
    
    // Vérifie les variables d'environnement avant le rendu
    checkEnvVars();
    
    // Rendu de l'application
    createRoot(rootElement).render(<App />);
    
    console.log('✅ Application rendue avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du rendu de l\'application:', error);
    
    // Afficher un message d'erreur lisible à l'utilisateur au lieu d'une page blanche
    document.body.innerHTML = `
      <div style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e11d48;">Erreur lors du chargement de Flowy Music</h1>
        <p>L'application n'a pas pu se charger correctement. Voici les détails de l'erreur :</p>
        <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; overflow-x: auto;">
          <pre>${error instanceof Error ? error.message : String(error)}</pre>
        </div>
        <p>Si le problème persiste, veuillez contacter l'équipe de support.</p>
        <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
          Réessayer
        </button>
      </div>
    `;
  }
}

// Exécution du rendu
renderApp();
