import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import FeaturedMusic from '@/components/FeaturedMusic';
import MusicSearch from '@/components/MusicSearch';
import RecordMusic from '@/components/recording/RecordMusic';
import CreatorProfile from '@/components/CreatorProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Music, 
  Search, 
  Mic, 
  UserSquare, 
  FilePlus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [activeCreateTab, setActiveCreateTab] = useState('recorder');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      navigate('/auth?tab=register', { replace: true });
    } else {
      setActiveTab('create');
    }
  };

  return (
    <Layout>
      <motion.div
        className="pb-24 max-w-full overflow-x-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8 md:mb-10 px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Créez, Enregistrez, Partagez
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
            Votre studio musical en ligne pour composer, enregistrer et partager votre musique
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md shadow-primary/20"
              onClick={handleCreateClick}
            >
              <Mic className="mr-2 h-5 w-5" />
              Commencer à créer
            </Button>
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "lg"} 
              className="rounded-full border-primary/20 hover:bg-primary/5"
              onClick={() => navigate('/shared-music')}
            >
              <Music className="mr-2 h-5 w-5 text-primary" />
              Explorer la bibliothèque
            </Button>
          </div>
        </motion.div>
        
        <Tabs 
          defaultValue="discover" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <motion.div variants={itemVariants} className="px-4 md:px-0">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-secondary/30 p-1 rounded-full border border-white/20 shadow-subtle flex-nowrap">
                <TabsTrigger value="discover" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <Music className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">Découvrir</span>
                </TabsTrigger>
                <TabsTrigger value="search" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <Search className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">Rechercher</span>
                </TabsTrigger>
                <TabsTrigger value="create" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <FilePlus className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">Créer</span>
                </TabsTrigger>
                <TabsTrigger value="creator" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <UserSquare className="h-4 w-4 mr-2" />
                  <span className="whitespace-nowrap">Profil</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </motion.div>
          
          <TabsContent value="discover" className="px-4 md:px-0">
            <FeaturedMusic />
          </TabsContent>
          
          <TabsContent value="search" className="px-4 md:px-0">
            <MusicSearch />
          </TabsContent>
          
          <TabsContent value="create" className="px-4 md:px-0">
            <RecordMusic key={activeCreateTab} activeInstrument="recorder" />
          </TabsContent>
          
          <TabsContent value="creator" className="px-4 md:px-0">
            <CreatorProfile />
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Index;
