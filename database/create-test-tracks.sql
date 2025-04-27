-- database/create-test-tracks.sql
-- Script SQL pour cru00e9er des pistes de test dans la base de donnu00e9es FlowyMusic

-- Fonction pour vu00e9rifier et cru00e9er les pistes de test
DO $$
DECLARE
    user_id INT;
    tracks_count INT;
    sample_tracks TEXT[] := ARRAY[
        'Dreams|Fleetwood Mac|Rock|3:45|https://example.com/audio/dreams.mp3',
        'Bohemian Rhapsody|Queen|Rock|5:55|https://example.com/audio/bohemian.mp3',
        'Billie Jean|Michael Jackson|Pop|4:54|https://example.com/audio/billie_jean.mp3',
        'Shape of You|Ed Sheeran|Pop|3:54|https://example.com/audio/shape_of_you.mp3',
        'Lose Yourself|Eminem|Hip Hop|5:26|https://example.com/audio/lose_yourself.mp3',
        'Loru00e9n|Juliette Armanet|Pop Franu00e7aise|3:48|https://example.com/audio/loren.mp3',
        'Imagine|John Lennon|Rock|3:03|https://example.com/audio/imagine.mp3'
    ];
    track_data TEXT[];
    title TEXT;
    artist TEXT;
    category TEXT;
    duration TEXT;
    audio_url TEXT;
BEGIN
    -- Vu00e9rifier si l'utilisateur testuser existe
    SELECT user_id INTO user_id FROM users WHERE username = 'testuser';
    
    IF user_id IS NULL THEN
        RAISE NOTICE 'L''utilisateur "testuser" n''existe pas. Veuillez le cru00e9er d''abord.';
        RETURN;
    END IF;
    
    -- Compter le nombre de pistes existantes
    SELECT COUNT(*) INTO tracks_count FROM tracks;
    
    RAISE NOTICE 'L''utilisateur "testuser" existe avec l''ID: %. % pistes existent du00e9ju00e0.', user_id, tracks_count;
    
    -- Si des pistes existent du00e9ju00e0, sortir sans rien faire
    IF tracks_count > 0 THEN
        RAISE NOTICE 'Des pistes existent du00e9ju00e0 dans la base de donnu00e9es. Aucune nouvelle piste n''a u00e9tu00e9 cru00e9u00e9e.';
        RETURN;
    END IF;
    
    -- Cru00e9er des pistes de test
    FOREACH track_info IN ARRAY sample_tracks
    LOOP
        track_data := string_to_array(track_info, '|');
        title := track_data[1];
        artist := track_data[2];
        category := track_data[3];
        duration := track_data[4];
        audio_url := track_data[5];
        
        INSERT INTO tracks (
            title,
            artist,
            category,
            duration,
            audio_url,
            user_id,
            plays,
            is_public,
            created_at,
            updated_at
        ) VALUES (
            title,
            artist,
            category,
            duration,
            audio_url,
            user_id,
            floor(random() * 1000)::INT,  -- Nombre alu00e9atoire d'u00e9coutes entre 0 et 999
            TRUE,  -- Toutes les pistes sont publiques
            CURRENT_TIMESTAMP - (random() * interval '90 days'),  -- Date de cru00e9ation alu00e9atoire dans les 90 derniers jours
            CURRENT_TIMESTAMP
        );
        
        RAISE NOTICE 'Piste cru00e9u00e9e: %', title;
    END LOOP;
    
    RAISE NOTICE '% pistes de test ont u00e9tu00e9 cru00e9u00e9es avec succu00e8s !', array_length(sample_tracks, 1);
END
$$;
