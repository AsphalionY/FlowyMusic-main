// Fichier d'index qui décide quelle implémentation musicService utiliser en fonction de l'environnement

/**
 * Cette approche utilise un import dynamique pour éviter l'erreur Vercel
 * "Uncaught TypeError: Le spécificateur « pg-promise » était un spécificateur simple, mais n'a pas été remappé"
 * 
 * - En environnement navigateur (Vercel), on utilise l'implémentation Supabase
 * - En environnement Node.js, on peut utiliser l'implémentation pg-promise
 */

// Vérifier si nous sommes dans un environnement navigateur
const isBrowser = typeof window !== 'undefined';

// Exportations des types (ceux-ci sont toujours nécessaires)
export interface SharedMusic {
  id: string;
  title: string;
  artist: string;
  uploadDate: Date;
  audioUrl: string;
  coverArt?: string;
  duration: string;
  uploadedBy: string;
  uploadedByName: string;
  plays: number;
  category?: import('../types/music').MusicCategory;
}

// Fonctions qui fonctionnent partout (côté client)
export { fileToBase64, calculateAudioDuration } from './musicServiceBrowser';

// Variables pour stocker les fonctions importées dynamiquement
let _addSharedMusic: any;
let _getAllSharedMusic: any;
let _getUserMusic: any;
let _getMusicByCategory: any;
let _searchMusic: any;
let _getSharedMusicById: any;
let _incrementPlayCount: any;

// Importation asynchrone du bon service
async function importMusicService() {
  try {
    if (isBrowser) {
      // Utiliser la version compatible navigateur (Supabase)
      const module = await import('./musicServiceBrowser');
      
      _addSharedMusic = module.addSharedMusic;
      _getAllSharedMusic = module.getAllSharedMusic;
      _getUserMusic = module.getUserMusic;
      _getMusicByCategory = module.getMusicByCategory;
      _searchMusic = module.searchMusic;
      _getSharedMusicById = module.getSharedMusicById;
      _incrementPlayCount = module.incrementPlayCount;
      
      console.log('✅ Utilisation du service music pour navigateur (Supabase)');
    } else {
      // Utiliser la version pg-promise (pour Node.js)
      try {
        const module = await import('./musicService');
        
        _addSharedMusic = module.addSharedMusic;
        _getAllSharedMusic = module.getAllSharedMusic;
        _getUserMusic = module.getUserMusic;
        _getMusicByCategory = module.getMusicByCategory;
        _searchMusic = module.searchMusic;
        _getSharedMusicById = module.getSharedMusicById;
        _incrementPlayCount = module.incrementPlayCount;
        
        console.log('✅ Utilisation du service music pour Node.js (pg-promise)');
      } catch (error) {
        console.error('❌ Erreur lors du chargement du service musicService:', error);
        
        // Fallback sur la version navigateur
        const module = await import('./musicServiceBrowser');
        
        _addSharedMusic = module.addSharedMusic;
        _getAllSharedMusic = module.getAllSharedMusic;
        _getUserMusic = module.getUserMusic;
        _getMusicByCategory = module.getMusicByCategory;
        _searchMusic = module.searchMusic;
        _getSharedMusicById = module.getSharedMusicById;
        _incrementPlayCount = module.incrementPlayCount;
        
        console.log('⚠️ Fallback sur le service music pour navigateur (Supabase)');
      }
    }
  } catch (error) {
    console.error('❌ Erreur critique lors de l\'importation des services music:', error);
    
    // Créer des fonctions factices en cas d'échec total
    _addSharedMusic = async () => { 
      console.error('Service music non disponible: addSharedMusic');
      throw new Error('Service music non disponible');
    };
    _getAllSharedMusic = async () => [];
    _getUserMusic = async () => [];
    _getMusicByCategory = async () => [];
    _searchMusic = async () => [];
    _getSharedMusicById = async () => undefined;
    _incrementPlayCount = async () => {};
  }
}

// Démarrer l'importation immédiatement
importMusicService();

// Wrappers qui utilisent les fonctions importées dynamiquement
export const addSharedMusic = async (music: Omit<SharedMusic, 'id' | 'plays' | 'uploadDate'>): Promise<SharedMusic> => {
  if (!_addSharedMusic) {
    await importMusicService();
  }
  return _addSharedMusic(music);
};

export const getAllSharedMusic = async (): Promise<SharedMusic[]> => {
  if (!_getAllSharedMusic) {
    await importMusicService();
  }
  return _getAllSharedMusic();
};

export const getUserMusic = async (userId: string): Promise<SharedMusic[]> => {
  if (!_getUserMusic) {
    await importMusicService();
  }
  return _getUserMusic(userId);
};

export const getMusicByCategory = async (category: import('../types/music').MusicCategory): Promise<SharedMusic[]> => {
  if (!_getMusicByCategory) {
    await importMusicService();
  }
  return _getMusicByCategory(category);
};

export const searchMusic = async (query: string): Promise<SharedMusic[]> => {
  if (!_searchMusic) {
    await importMusicService();
  }
  return _searchMusic(query);
};

export const getSharedMusicById = async (id: string): Promise<SharedMusic | undefined> => {
  if (!_getSharedMusicById) {
    await importMusicService();
  }
  return _getSharedMusicById(id);
};

export const incrementPlayCount = async (id: string): Promise<void> => {
  if (!_incrementPlayCount) {
    await importMusicService();
  }
  return _incrementPlayCount(id);
};
