import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { User } from './auth-utils';
import { AuthContext } from './auth-context';
import { supabase } from '@/config/supabase';

// Interface pour les données d'utilisateur Supabase
interface SupabaseUserData {
  id: string;
  email: string;
  user_metadata: {
    username?: string;
    profile_image_url?: string;
    bio?: string;
  }
}

// Le composant SupabaseAuthProvider remplace AuthProvider
const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Convertir un utilisateur Supabase en format User
  const transformSupabaseUser = (supabaseUser: SupabaseUserData): User => {
    return {
      id: supabaseUser.id,
      username: supabaseUser.user_metadata?.username || 'Utilisateur',
      email: supabaseUser.email,
      profileImage: supabaseUser.user_metadata?.profile_image_url || undefined,
      bio: supabaseUser.user_metadata?.bio || undefined,
      createdAt: new Date().toISOString(),
      followers: 0,
      following: 0,
      tracks: 0
    };
  };

  // Vérifier la session Supabase au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer la session active
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          // Utilisateur déjà connecté
          const userData = transformSupabaseUser(session.user as unknown as SupabaseUserData);
          setUser(userData);
          
          // Configurer l'écouteur de changements d'authentification
          const { data: { subscription } } = await supabase.auth.onAuthStateChange(
            (_event, session) => {
              if (session?.user) {
                const userData = transformSupabaseUser(session.user as unknown as SupabaseUserData);
                setUser(userData);
              } else {
                setUser(null);
              }
            }
          );
          
          // Nettoyer l'abonnement
          return () => {
            subscription.unsubscribe();
          };
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        toast.error('Erreur lors de la vérification de l\'authentification');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction pour se connecter avec Supabase
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Afficher des logs pour le déboggage
      console.log(`🔄 Tentative de connexion avec Supabase:`, { email });
      
      // Connexion avec Supabase (email/password)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Erreur de connexion:', error.message);
        toast.error(error.message || 'Email ou mot de passe incorrect');
        return false;
      }
      
      if (data?.user) {
        // Convertir l'utilisateur Supabase en format User
        const userData = transformSupabaseUser(data.user as unknown as SupabaseUserData);
        setUser(userData);
        
        console.log('✅ Connexion réussie:', userData);
        toast.success('Connexion réussie');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour s'inscrire avec Supabase
  const register = useCallback(async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Inscription avec Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) {
        console.error('❌ Erreur d\'inscription:', error.message);
        toast.error(error.message || 'Erreur lors de l\'inscription');
        return false;
      }
      
      if (data?.user) {
        // Convertir l'utilisateur Supabase en format User
        const userData = transformSupabaseUser(data.user as unknown as SupabaseUserData);
        setUser(userData);
        
        toast.success('Inscription réussie! Vérifiez votre email pour confirmer votre compte.');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      toast.error(error.message || 'Erreur lors de l\'inscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour se déconnecter
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Déconnexion avec Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      toast.error(error.message || 'Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour mettre à jour le profil
  const updateProfile = useCallback(async (profileData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error('Vous devez être connecté pour mettre à jour votre profil');
        return false;
      }
      
      // Mettre à jour les métadonnées de l'utilisateur
      const { data, error } = await supabase.auth.updateUser({
        data: {
          username: profileData.username || user.username,
          profile_image_url: profileData.profileImage || user.profileImage,
          bio: profileData.bio || user.bio,
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        // Mettre à jour l'utilisateur dans l'état
        const updatedUser = transformSupabaseUser(data.user as unknown as SupabaseUserData);
        setUser(updatedUser);
        
        toast.success('Profil mis à jour avec succès');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Créer le contexte avec les valeurs
  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  }), [user, isLoading, login, register, logout, updateProfile]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { SupabaseAuthProvider };
