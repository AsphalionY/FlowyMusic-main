import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { authenticateUser } from '@/services/authService';
import { saveUserSession } from '@/utils/authUtils';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = await authenticateUser({ email, password });
      
      if (user) {
        // Enregistrer la session utilisateur
        saveUserSession(user);
        
        toast.success('Connexion ru00e9ussie', {
          description: `Bienvenue, ${user.username} !`
        });
        
        // Appeler la callback de succu00e8s si elle existe
        if (onSuccess) onSuccess();
      } else {
        toast.error('Connexion u00e9chouu00e9e', {
          description: 'Email ou mot de passe incorrect'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast.error('Erreur lors de la connexion', {
        description: 'Une erreur inattendue est survenue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Connexion</h2>
        <p className="text-muted-foreground mt-2">
          Connectez-vous u00e0 votre compte FlowyMusic
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="email@exemple.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </form>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Pour les tests, utilisez :
          <br />
          Email: <code>test@example.com</code>
          <br />
          Mot de passe: <code>testpassword</code>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
