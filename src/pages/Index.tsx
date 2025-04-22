import { useState, useRef, useEffect } from 'react';
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
  ListMusic,
  FilePlus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);

  // Lors du changement de tab sur mobile: auto-scroll pour rendre le bouton visible
  useEffect(() => {
    if (!isMobile) return;
    const ref = triggerRefs.current[activeTab];
    if (ref && scrollWrapperRef.current) {
      ref.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
      });
    }
  }, [activeTab, isMobile]);
  
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
          <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent py-1 md:py-2 leading-relaxed md:leading-loose">
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
              data-testid="start-creating-button"
            >
              <Mic className="mr-2 h-5 w-5" />
              Commencer à créer
            </Button>
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "lg"} 
              className="rounded-full border-primary/20 hover:bg-primary/5"
              onClick={() => navigate('/shared-music')}
              data-testid="library-link"
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
            <div
              ref={scrollWrapperRef}
              className="flex justify-center mb-6 w-full"
            >
              <div
                className={
                  "relative w-full max-w-md mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] " +
                  (isMobile ? "overflow-x-auto pr-2" : "")
                }
                style={{
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <TabsList
                  className={
                    "relative bg-secondary/30 p-1 rounded-full border border-white/20 shadow-subtle flex-nowrap mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] " +
                    (isMobile ? "flex gap-1 min-w-fit px-0.5" : "gap-2")
                  }
                  style={{
                    width: isMobile ? "fit-content" : undefined,
                    minWidth: isMobile ? "100%" : undefined
                  }}
                >
                  <motion.div
                    className="absolute h-[calc(100%-8px)] top-1 rounded-full bg-white shadow-sm"
                    layoutId="activeTabBackground"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                  <TabsTrigger
                    value="discover"
                    ref={el => (triggerRefs.current['discover'] = el)}
                    className="relative rounded-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    <Music className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">Découvrir</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="search"
                    ref={el => (triggerRefs.current['search'] = el)}
                    className="relative rounded-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">Rechercher</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="create"
                    ref={el => (triggerRefs.current['create'] = el)}
                    disabled={!isAuthenticated}
                    className={`relative rounded-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none
                      ${!isAuthenticated ? 'bg-gray-200 text-gray-400 pointer-events-none' : ''}`
                    }
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">Créer</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="playlist"
                    ref={el => (triggerRefs.current['playlist'] = el)}
                    disabled={!isAuthenticated}
                    className={`relative rounded-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none
                      ${!isAuthenticated ? 'bg-gray-200 text-gray-400 pointer-events-none' : ''}`
                    }
                  >
                    <ListMusic className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">Playlist</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </motion.div>
          
          <TabsContent value="discover" className="px-4 md:px-0">
            <FeaturedMusic />
          </TabsContent>
          
          <TabsContent value="search" className="px-4 md:px-0">
            <MusicSearch />
          </TabsContent>
          
          <TabsContent value="create" className="px-4 md:px-0 overflow-hidden">
            <RecordMusic />
          </TabsContent>
          
          <TabsContent value="playlist" className="px-4 md:px-0 overflow-hidden">
            <CreatorProfile />
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Index;
