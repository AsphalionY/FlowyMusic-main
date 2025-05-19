import React from 'react';
import { Music } from 'lucide-react';

const UserMusicLibrary = () => {
  return (
    <div className="text-center py-8 md:py-12">
      <div className="mx-auto bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <Music className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">Bibliothèque vide</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Aucune musique disponible dans votre bibliothèque pour le moment.
      </p>
    </div>
  );
};

export default UserMusicLibrary;
