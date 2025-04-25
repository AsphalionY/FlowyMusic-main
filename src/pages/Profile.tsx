import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Music } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import UserMusicLibrary from '@/components/UserMusicLibrary';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileAbout from '@/components/profile/ProfileAbout';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleEditProfile = () => {
    navigate('/create-profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (isLoading || !user) {
    return (
      <Layout>
        <div className="w-full flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const formattedDate = user.createdAt
    ? format(new Date(user.createdAt), 'MMMM yyyy', { locale: fr })
    : '';

  const categoryLabels: { [key: string]: string } = {
    rap: 'Rap',
    rock: 'Rock',
    pop: 'Pop',
    electro: 'Électronique',
    jazz: 'Jazz',
    classique: 'Classique',
    autre: 'Autre',
  };

  return (
    <Layout>
      <motion.div
        className="w-full max-w-4xl mx-auto py-4 px-4 md:px-0 md:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <ProfileHeader
            user={user}
            categoryLabels={categoryLabels}
            onEditProfile={handleEditProfile}
            onLogout={handleLogout}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="tracks" className="w-full">
            <TabsList className="mb-4 md:mb-6 w-full justify-start overflow-x-auto no-scrollbar">
              <TabsTrigger value="tracks">Mes morceaux</TabsTrigger>
              <TabsTrigger value="favorites">Mes favoris</TabsTrigger>
              <TabsTrigger value="about">À propos</TabsTrigger>
            </TabsList>

            <TabsContent value="tracks">
              <UserMusicLibrary />
            </TabsContent>

            <TabsContent value="favorites">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-border p-6 text-center">
                <Music className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">Aucun favori</h3>
                <p className="text-muted-foreground mt-2">
                  Vous n'avez pas encore ajouté de morceaux à vos favoris.
                </p>
                <Button onClick={() => navigate('/')} className="mt-4">
                  Explorer la musique
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="about">
              <ProfileAbout
                user={user}
                formattedDate={formattedDate}
                categoryLabels={categoryLabels}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Profile;
