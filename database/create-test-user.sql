-- database/create-test-user.sql
-- Script SQL pour cru00e9er un utilisateur de test dans la base de donnu00e9es FlowyMusic

-- Vu00e9rifier si l'utilisateur existe du00e9ju00e0
DO $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM users WHERE username = 'testuser') INTO user_exists;
    
    IF user_exists THEN
        RAISE NOTICE 'L''utilisateur "testuser" existe du00e9ju00e0.';
    ELSE
        -- Cru00e9er un nouvel utilisateur
        INSERT INTO users (
            username, 
            email, 
            password_hash, 
            profile_image_url, 
            bio, 
            created_at, 
            updated_at
        ) VALUES (
            'testuser', 
            'test@example.com', 
            'hashed_password', -- En production, utilisez bcrypt pour hacher le mot de passe
            NULL, 
            'Utilisateur de test',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
        
        RAISE NOTICE 'Utilisateur "testuser" cru00e9u00e9 avec succu00e8s !';
    END IF;
END
$$;
