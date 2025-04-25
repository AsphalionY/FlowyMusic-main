import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredProps {
  className?: string;
}

const AuthRequired = ({ className }: AuthRequiredProps) => {
  const navigate = useNavigate();

  return (
    <div className={className}>
      <div className="text-center space-y-4">
        <div className="bg-secondary/40 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold">Connexion requise</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Vous devez être connecté pour télécharger et partager de la musique sur HarmonyBot.
        </p>
        <Button onClick={() => navigate('/auth')} size="lg" className="mt-4">
          Se connecter
        </Button>
      </div>
    </div>
  );
};

export default AuthRequired;
