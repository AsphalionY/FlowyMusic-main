import { MusicCategory } from './music';

export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  profile_image_url?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Track {
  track_id: number;
  title: string;
  artist_id: number;
  audio_url: string;
  cover_art_url?: string;
  duration: string;
  category?: MusicCategory;
  plays: number;
  is_remix: boolean;
  original_track_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Playlist {
  playlist_id: number;
  name: string;
  user_id: number;
  cover_image_url?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PlaylistTrack {
  playlist_id: number;
  track_id: number;
  position: number;
  added_at: Date;
}

export interface Like {
  user_id: number;
  track_id: number;
  created_at: Date;
}

export interface Comment {
  comment_id: number;
  track_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface Follow {
  follower_id: number;
  following_id: number;
  created_at: Date;
}
