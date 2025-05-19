
import { Music } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SharedMusicPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="pb-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Bibliothèque Musicale</h1>
            <p className="text-muted-foreground">
              Découvrez et écoutez la musique ajoutée par la communauté
            </p>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-8 text-center">
          <div className="mx-auto flex flex-col items-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
              <Music className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="text-lg font-medium mb-2">Aucune musique disponible</h3>

            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              La bibliothèque est actuellement vide. Revenez plus tard pour découvrir du nouveau
              contenu.
            </p>

            <Button onClick={() => navigate('/')} className="rounded-full">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SharedMusicPage;
