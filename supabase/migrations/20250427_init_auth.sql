-- Migration pour adapter le schéma d'authentification Supabase avec la table users existante
-- Cette migration est prévue pour être exécutée sur Supabase

-- Activer l'extension UUID si pas déjà fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table de correspondance entre auth.users et notre table users existante
CREATE TABLE IF NOT EXISTS public.auth_user_mapping (
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id BIGINT REFERENCES public.users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Commentaire sur la table
COMMENT ON TABLE public.auth_user_mapping IS 'Table de correspondance entre les IDs de Supabase Auth et notre table users existante';

-- RLS (Row Level Security) pour sécuriser l'accès aux données
ALTER TABLE public.auth_user_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table de correspondance
-- Seul l'utilisateur peut voir ses propres entrées dans la table de correspondance
CREATE POLICY "Les utilisateurs peuvent voir leurs propres entrées" ON public.auth_user_mapping
  FOR SELECT USING (auth.uid() = auth_id);

-- Politiques pour les utilisateurs
-- Tout le monde peut lire les profils utilisateurs publics
CREATE POLICY "Les profils utilisateurs sont visibles par tous" ON public.users
  FOR SELECT USING (true);

-- Seul l'utilisateur propriétaire peut modifier son profil
CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" ON public.users
  FOR UPDATE USING (user_id IN (SELECT user_id FROM public.auth_user_mapping WHERE auth_id = auth.uid()));

-- Fonction pour créer automatiquement un utilisateur dans notre table users après inscription
CREATE OR REPLACE FUNCTION public.create_user_for_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id BIGINT;
BEGIN
  -- Insérer un nouvel utilisateur
  INSERT INTO public.users (username, email, password_hash, created_at, updated_at)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    'auth_managed_by_supabase', -- On n'utilise plus le password_hash directement
    NOW(),
    NOW()
  )
  RETURNING user_id INTO new_user_id;
  
  -- Créer l'association entre auth.users et notre table users
  INSERT INTO public.auth_user_mapping (auth_id, user_id)
  VALUES (NEW.id, new_user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer un utilisateur quand un auth.user s'inscrit
CREATE TRIGGER create_user_after_auth_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_user_for_auth_user();

-- Mettre à jour la fonction pour gérer les mises à jour des métadonnées utilisateur
CREATE OR REPLACE FUNCTION public.update_user_from_auth_metadata()
RETURNS TRIGGER AS $$
DECLARE
  local_user_id BIGINT;
BEGIN
  -- Récupérer l'ID utilisateur correspondant à cet auth.user
  SELECT user_id INTO local_user_id FROM public.auth_user_mapping WHERE auth_id = NEW.id;
  
  IF local_user_id IS NOT NULL AND NEW.raw_user_meta_data IS NOT NULL THEN
    UPDATE public.users 
    SET 
      username = COALESCE(NEW.raw_user_meta_data->>'username', users.username),
      bio = COALESCE(NEW.raw_user_meta_data->>'bio', users.bio),
      profile_image_url = COALESCE(NEW.raw_user_meta_data->>'profile_image_url', users.profile_image_url),
      updated_at = now()
    WHERE user_id = local_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour l'utilisateur quand les métadonnées auth changent
CREATE TRIGGER update_user_on_auth_metadata_change
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data)
EXECUTE FUNCTION public.update_user_from_auth_metadata();

-- Fonction pour maintenir les emails synchronisés
CREATE OR REPLACE FUNCTION public.sync_email_to_users()
RETURNS TRIGGER AS $$
DECLARE
  local_user_id BIGINT;
BEGIN
  -- Récupérer l'ID utilisateur correspondant à cet auth.user
  SELECT user_id INTO local_user_id FROM public.auth_user_mapping WHERE auth_id = NEW.id;
  
  IF local_user_id IS NOT NULL AND NEW.email IS DISTINCT FROM OLD.email THEN
    -- Mettre à jour l'email
    UPDATE public.users SET email = NEW.email WHERE user_id = local_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour maintenir les emails synchronisés
CREATE TRIGGER sync_email_on_auth_change
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.email IS DISTINCT FROM OLD.email)
EXECUTE FUNCTION public.sync_email_to_users();
