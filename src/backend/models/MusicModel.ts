/**
 * Modèles de données pour la gestion de la musique
 */

/**
 * Représente une musique dans le système
 */
export interface Music {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  audioUrl: string;
  coverImageUrl?: string;
  style: string;
  compositionType: string;
  isPublic: boolean;
  allowReuse: boolean;
  createdAt: string;
  duration: number;
  waveform?: number[];
}

/**
 * Paramètres pour la création d'une nouvelle musique
 */
export interface CreateMusicParams {
  title: string;
  audioBlob: Blob;
  coverImage?: File;
  style: string;
  compositionType: string;
  allowReuse: boolean;
}

/**
 * Paramètres pour rendre une musique publique
 */
export interface PublishMusicParams {
  musicId: string;
  isPublic: boolean;
}

/**
 * Représente une playlist dans le système
 */
export interface Playlist {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  coverImageUrl?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  trackCount: number;
  tracks: Music[];
}
