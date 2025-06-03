import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Music, Image as ImageIcon, X, Share2, ListMusic, ChevronLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts';
import { toast } from 'sonner';
import { MusicCategory } from '@/types/music';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PlaylistProps {
  className?: string;
}

interface PlaylistItem {
  id: string;
  title: string;
  imageUrl: string | null;
  description: string;
  songs: Song[];
  userId?: string;
  isDefault?: boolean;
}

interface Song {
  id: string;
  title: string;
  imageUrl: string | null;
  audioUrl?: string;
}

const Playlist = ({ className }: PlaylistProps) => {
  const { user } = useAuth();
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [isSavingToPlaylists, setIsSavingToPlaylists] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistItem | null>(null);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<Partial<PlaylistItem>>({
    title: '',
    imageUrl: null,
    description: '',
    songs: [],
  });
  const [newSong, setNewSong] = useState<Partial<Song>>({
    title: '',
    imageUrl: null,
  });
  const [tempSong, setTempSong] = useState<Partial<Song> | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [songImagePreview, setSongImagePreview] = useState<string | null>(null);
  
  // Charger les playlists au démarrage et créer "Mes morceaux" si elle n'existe pas
  useEffect(() => {
    if (user) {
      // Charger les playlists depuis localStorage
      const storedPlaylists = localStorage.getItem('playlists');
      let playlists: PlaylistItem[] = storedPlaylists ? JSON.parse(storedPlaylists) : [];
      
      // Filtrer les playlists de l'utilisateur actuel
      const userPlaylists = playlists.filter(p => !p.userId || p.userId === user.id);
      
      // Vérifier si "Mes morceaux" existe déjà pour cet utilisateur
      const hasDefaultPlaylist = userPlaylists.some(p => p.isDefault && p.userId === user.id);
      
      if (!hasDefaultPlaylist) {
        // Créer la playlist par défaut "Mes morceaux"
        const defaultPlaylist: PlaylistItem = {
          id: `playlist-${Date.now()}`,
          title: "Mes morceaux",
          imageUrl: null,
          description: "Ma playlist personnelle",
          songs: [],
          userId: user.id,
          isDefault: true
        };
        
        // Ajouter à la liste complète des playlists
        playlists.push(defaultPlaylist);
        localStorage.setItem('playlists', JSON.stringify(playlists));
        
        // Mettre à jour les playlists locales
        userPlaylists.push(defaultPlaylist);
      }
      
      setPlaylistItems(userPlaylists);
    }
  }, [user]);

  const handleAddItem = () => {
    setIsAddingItem(true);
    setNewItem({
      title: '',
      imageUrl: null,
      description: '',
      songs: [],
    });
    setImagePreview(null);
  };

  const handleCancelAdd = () => {
    setIsAddingItem(false);
    setNewItem({
      title: '',
      imageUrl: null,
      description: '',
      songs: [],
    });
    setImagePreview(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setNewItem({ ...newItem, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSongImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSongImagePreview(base64String);
        setNewSong({ ...newSong, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = () => {
    if (!newItem.title) {
      toast.error('Veuillez ajouter un titre à votre playlist');
      return;
    }

    const item: PlaylistItem = {
      id: `item-${Date.now()}`,
      title: newItem.title ?? 'Sans titre',
      imageUrl: newItem.imageUrl ?? null,
      description: newItem.description ?? '',
      songs: [],
      userId: user?.id
    };

    // Mettre à jour la liste locale
    const updatedPlaylistItems = [...playlistItems, item];
    setPlaylistItems(updatedPlaylistItems);
    
    // Sauvegarder dans localStorage
    const storedPlaylists = localStorage.getItem('playlists');
    let allPlaylists: PlaylistItem[] = storedPlaylists ? JSON.parse(storedPlaylists) : [];
    
    // Filtrer les playlists qui n'appartiennent pas à l'utilisateur actuel
    const otherPlaylists = allPlaylists.filter(p => p.userId && p.userId !== user?.id);
    
    // Combiner avec les playlists mises à jour
    localStorage.setItem('playlists', JSON.stringify([...otherPlaylists, ...updatedPlaylistItems]));
    
    setIsAddingItem(false);
    setNewItem({
      title: '',
      imageUrl: null,
      description: '',
      songs: [],
    });
    setImagePreview(null);
    toast.success('Playlist ajoutée');
  };

  const handleRemoveItem = (id: string) => {
    // Ne pas supprimer si c'est la playlist par défaut "Mes morceaux"
    const playlist = playlistItems.find(item => item.id === id);
    if (playlist?.isDefault) {
      toast.error('Impossible de supprimer la playlist par défaut "Mes morceaux"');
      return;
    }
    
    // Supprimer de la liste locale
    const updatedPlaylistItems = playlistItems.filter(item => item.id !== id);
    setPlaylistItems(updatedPlaylistItems);
    
    // Supprimer de localStorage
    const storedPlaylists = localStorage.getItem('playlists');
    if (storedPlaylists) {
      const allPlaylists: PlaylistItem[] = JSON.parse(storedPlaylists);
      const filteredPlaylists = allPlaylists.filter(item => item.id !== id);
      localStorage.setItem('playlists', JSON.stringify(filteredPlaylists));
    }
    
    toast.info('Playlist supprimée');
  };

  const handleOpenPlaylist = (playlist: PlaylistItem) => {
    setSelectedPlaylist(playlist);
  };

  const handleClosePlaylist = () => {
    setSelectedPlaylist(null);
    setIsAddingSong(false);
    setNewSong({
      title: '',
      imageUrl: null,
    });
    setSongImagePreview(null);
  };

  const handleAddSong = () => {
    setIsAddingSong(true);
    setNewSong({
      title: '',
      imageUrl: null,
    });
    setSongImagePreview(null);
  };

  const handleCancelAddSong = () => {
    setIsAddingSong(false);
    setNewSong({
      title: '',
      imageUrl: null,
    });
    setSongImagePreview(null);
  };
  
  // Fonction pour ouvrir l'interface de sélection de playlists
  const handleSaveToPlaylists = (song: Partial<Song>) => {
    setTempSong(song);
    setIsSavingToPlaylists(true);
    setSelectedPlaylists([]); // Réinitialiser la sélection
  };
  
  // Gérer la sélection/désélection d'une playlist
  const togglePlaylistSelection = (playlistId: string) => {
    setSelectedPlaylists(prev => {
      if (prev.includes(playlistId)) {
        return prev.filter(id => id !== playlistId);
      } else {
        return [...prev, playlistId];
      }
    });
  };
  
  // Annuler la sélection de playlists
  const handleCancelPlaylistSelection = () => {
    setIsSavingToPlaylists(false);
    setTempSong(null);
    setSelectedPlaylists([]);
  };
  
  // Ajouter la chanson aux playlists sélectionnées
  const handleAddToSelectedPlaylists = () => {
    if (!tempSong || !tempSong.title || selectedPlaylists.length === 0) {
      toast.error('Veuillez sélectionner au moins une playlist');
      return;
    }
    
    const song: Song = {
      id: `song-${Date.now()}`,
      title: tempSong.title,
      imageUrl: tempSong.imageUrl ?? null,
      audioUrl: tempSong.audioUrl
    };
    
    // Mettre à jour les playlists sélectionnées
    const updatedPlaylists = playlistItems.map(item => {
      if (selectedPlaylists.includes(item.id)) {
        return {
          ...item,
          songs: [...item.songs, song]
        };
      }
      return item;
    });
    
    setPlaylistItems(updatedPlaylists);
    
    // Sauvegarder dans localStorage
    const storedPlaylists = localStorage.getItem('playlists');
    if (storedPlaylists) {
      const allPlaylists: PlaylistItem[] = JSON.parse(storedPlaylists);
      
      // Mettre à jour les playlists concernées
      const updatedAllPlaylists = allPlaylists.map(item => {
        if (selectedPlaylists.includes(item.id)) {
          return {
            ...item,
            songs: [...(item.songs || []), song]
          };
        }
        return item;
      });
      
      localStorage.setItem('playlists', JSON.stringify(updatedAllPlaylists));
    }
    
    setIsSavingToPlaylists(false);
    setTempSong(null);
    setSelectedPlaylists([]);
    toast.success(`Morceau ajouté à ${selectedPlaylists.length} playlist(s)`);
  };

  const handleSaveSong = () => {
    if (!selectedPlaylist) return;

    if (!newSong.title) {
      toast.error('Veuillez ajouter un titre à votre musique');
      return;
    }

    // Ouvrir l'interface de sélection de playlists
    handleSaveToPlaylists(newSong);
    
    // Pré-sélectionner la playlist actuelle
    setSelectedPlaylists([selectedPlaylist.id]);
    
    // Nettoyer l'interface d'ajout de chanson
    setIsAddingSong(false);
    setNewSong({
      title: '',
      imageUrl: null,
    });
    setSongImagePreview(null);
  };

  const handleRemoveSong = (songId: string) => {
    if (!selectedPlaylist) return;

    const updatedSongs = selectedPlaylist.songs.filter(song => song.id !== songId);
    const updatedPlaylist = {
      ...selectedPlaylist,
      songs: updatedSongs,
    };

    setPlaylistItems(
      playlistItems.map(item => (item.id === selectedPlaylist.id ? updatedPlaylist : item))
    );

    setSelectedPlaylist(updatedPlaylist);
    toast.info('Musique supprimée de la playlist');
  };

  const handleShareItem = (title: string) => {
    // Simuler le partage
    toast.success(`Lien de partage pour "${title}" copié dans le presse-papier`);
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

  return (
    <motion.div
      className={cn('space-y-6', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Résumé du profil */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 shadow-subtle"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={user?.profileImage} alt={user?.username} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user?.username ?? 'Utilisateur'}</h2>
            <p className="text-muted-foreground text-sm">
              {user?.bio ?? 'Aucune biographie disponible'}
            </p>
            <div className="flex gap-2 mt-2">
              {user?.preferredCategories && user.preferredCategories.length > 0 ? (
                user.preferredCategories.slice(0, 3).map((category: MusicCategory) => (
                  <span
                    key={`category-${category}`}
                    className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  Musique
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vue d'une playlist spécifique */}
      {isSavingToPlaylists && (
        <motion.div
          className="absolute inset-0 bg-background/90 z-20 flex flex-col p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={handleCancelPlaylistSelection}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold">Ajouter à des playlists</h2>
          </div>
          
          {tempSong && (
            <div className="mb-4 bg-card p-3 rounded-lg shadow-sm">
              <div className="flex items-center">
                {tempSong.imageUrl ? (
                  <img
                    src={tempSong.imageUrl}
                    alt={tempSong.title}
                    className="w-12 h-12 rounded-md object-cover mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-secondary/30 flex items-center justify-center mr-3">
                    <Music className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{tempSong.title}</h3>
                  <p className="text-sm text-muted-foreground">Sélectionnez les playlists</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-2 mb-4 max-h-[60vh] overflow-y-auto">
            {playlistItems.map(playlist => (
              <div 
                key={playlist.id}
                className={cn(
                  "flex items-center p-2 rounded-lg cursor-pointer transition-colors",
                  selectedPlaylists.includes(playlist.id) 
                    ? "bg-primary/10 border border-primary/30" 
                    : "hover:bg-secondary/20 border border-transparent"
                )}
                onClick={() => togglePlaylistSelection(playlist.id)}
              >
                <div className="w-10 h-10 rounded-md bg-secondary/30 relative mr-3 flex-shrink-0">
                  {playlist.imageUrl ? (
                    <img
                      src={playlist.imageUrl}
                      alt={playlist.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ListMusic className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  {selectedPlaylists.includes(playlist.id) && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium text-sm">{playlist.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {playlist.songs.length} {playlist.songs.length > 1 ? 'titres' : 'titre'}
                  </p>
                </div>
                
                <Checkbox 
                  checked={selectedPlaylists.includes(playlist.id)}
                  className="ml-2 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  onCheckedChange={() => togglePlaylistSelection(playlist.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-auto flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelPlaylistSelection}>Annuler</Button>
            <Button 
              onClick={handleAddToSelectedPlaylists}
              disabled={selectedPlaylists.length === 0}
            >
              Ajouter aux {selectedPlaylists.length} playlist{selectedPlaylists.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </motion.div>
      )}
      
      {selectedPlaylist ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClosePlaylist}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">{selectedPlaylist.title}</h2>
          </div>

          {/* En-tête de la playlist */}
          <div className="flex items-center gap-4 bg-card p-4 rounded-lg">
            <div className="w-20 h-20 rounded-md bg-secondary/50 flex items-center justify-center overflow-hidden">
              {selectedPlaylist.imageUrl ? (
                <img
                  src={selectedPlaylist.imageUrl}
                  alt={selectedPlaylist.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ListMusic className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{selectedPlaylist.title}</h3>
              {selectedPlaylist.description && (
                <p className="text-sm text-muted-foreground mt-1">{selectedPlaylist.description}</p>
              )}
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="h-8" onClick={handleAddSong}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Ajouter une musique
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => handleShareItem(selectedPlaylist.title)}
                >
                  <Share2 className="h-3.5 w-3.5 mr-1" />
                  Partager
                </Button>
              </div>
            </div>
          </div>

          {/* Formulaire d'ajout de musique */}
          {isAddingSong && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Ajouter une musique</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCancelAddSong}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="newSongTitle" className="block text-sm font-medium mb-1">
                    Titre
                  </label>
                  <Input
                    id="newSongTitle"
                    placeholder="Titre de la musique"
                    value={newSong.title ?? ''}
                    onChange={e => setNewSong({ ...newSong, title: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="newSongImage" className="block text-sm font-medium mb-1">
                    Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md bg-secondary/50 flex items-center justify-center overflow-hidden">
                      {songImagePreview ? (
                        <img
                          src={songImagePreview}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <label className="flex-1">
                      <div className="flex items-center justify-center w-full h-9 px-3 py-2 text-xs border border-dashed rounded-md cursor-pointer hover:bg-secondary/50">
                        <ImageIcon className="mr-2 h-3.5 w-3.5" />
                        Choisir une image
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSongImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelAddSong}>
                    Annuler
                  </Button>
                  <Button size="sm" onClick={handleSaveSong}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Liste des musiques */}
          <div className="space-y-2">
            {selectedPlaylist.songs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune musique dans cette playlist
              </div>
            ) : (
              selectedPlaylist.songs.map(song => (
                <motion.div
                  key={song.id}
                  variants={itemVariants}
                  className="flex items-center gap-3 bg-secondary/20 p-3 rounded-md hover:bg-secondary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-secondary/50 flex items-center justify-center overflow-hidden">
                    {song.imageUrl ? (
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{song.title}</h4>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleShareItem(song.title)}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveSong(song.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      ) : (
        <>
          {/* Formulaire d'ajout de playlist */}
          {isAddingItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Ajouter une playlist</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancelAdd}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="newPlaylistTitle" className="block text-sm font-medium mb-1">
                    Titre
                  </label>
                  <Input
                    id="newPlaylistTitle"
                    placeholder="Titre de la playlist"
                    value={newItem.title ?? ''}
                    onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="newPlaylistImage" className="block text-sm font-medium mb-1">
                    Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-md bg-secondary/50 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <label className="flex-1">
                      <div className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm border border-dashed rounded-md cursor-pointer hover:bg-secondary/50">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Choisir une image
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="newPlaylistDescription"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <Textarea
                    id="newPlaylistDescription"
                    placeholder="Description de la playlist (optionnel)"
                    value={newItem.description ?? ''}
                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelAdd}>
                    Annuler
                  </Button>
                  <Button onClick={handleSaveItem}>Ajouter</Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Liste des playlists */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
            {playlistItems.map(item => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenPlaylist(item)}
              >
                <div className="aspect-square bg-secondary/30 relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ListMusic className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 bg-background/80 hover:bg-background/90 rounded-full"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm truncate">{item.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {item.songs.length} {item.songs.length > 1 ? 'titres' : 'titre'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={e => {
                        e.stopPropagation();
                        handleShareItem(item.title);
                      }}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Carré avec + pour ajouter rapidement */}
            {!isAddingItem && (
              <motion.div
                variants={itemVariants}
                className="bg-card border border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={handleAddItem}
              >
                <Plus className="h-6 w-6 text-primary mb-1" />
                <span className="text-xs text-muted-foreground">Ajouter une playlist</span>
              </motion.div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Playlist;
