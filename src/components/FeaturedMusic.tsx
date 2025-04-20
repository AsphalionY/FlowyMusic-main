
import React from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedMusicProps {
  className?: string;
}

const FeaturedMusic = ({ className }: FeaturedMusicProps) => {
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
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className={cn("space-y-10", className)}>
      <div className="text-center py-8">
        <div className="mx-auto bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Music className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">Aucun contenu pour le moment</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Les playlists et artistes recommandés apparaîtront ici une fois que du contenu sera disponible.
        </p>
      </div>
    </div>
  );
};

export default FeaturedMusic;
