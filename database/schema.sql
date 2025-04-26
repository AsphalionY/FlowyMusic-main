-- Table des utilisateurs
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des musiques originales
CREATE TABLE tracks (
    track_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL,
    cover_art_url TEXT,
    duration VARCHAR(10) NOT NULL,
    category VARCHAR(50),
    plays INTEGER DEFAULT 0,
    is_remix BOOLEAN DEFAULT FALSE,
    original_track_id INTEGER REFERENCES tracks(track_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Contrainte pour s'assurer qu'une piste remix a un original
    CONSTRAINT remix_has_original CHECK (
        (is_remix = FALSE AND original_track_id IS NULL) OR
        (is_remix = TRUE AND original_track_id IS NOT NULL)
    )
);

-- Table des playlists
CREATE TABLE playlists (
    playlist_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison entre playlists et musiques
CREATE TABLE playlist_tracks (
    playlist_id INTEGER REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(track_id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, track_id)
);

-- Table des likes
CREATE TABLE likes (
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(track_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, track_id)
);

-- Table des commentaires
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    track_id INTEGER NOT NULL REFERENCES tracks(track_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des abonnements (followers/following)
CREATE TABLE follows (
    follower_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    -- Empêcher un utilisateur de se suivre lui-même
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Indices pour optimiser les requêtes fréquentes
CREATE INDEX idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX idx_tracks_category ON tracks(category);
CREATE INDEX idx_playlist_tracks_track_id ON playlist_tracks(track_id);
CREATE INDEX idx_comments_track_id ON comments(track_id);