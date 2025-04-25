import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Plus, Clock, X, Check, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { searchMusic, SharedMusic } from '@/services/musicService';

// Déclaration pour étendre l'interface Window
declare global {
  interface Window {
    musicPlayer?: {
      playTrack: (track: SharedMusic) => void;
    };
  }
}

const MusicSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SharedMusic[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Effectuer une recherche lorsque l'utilisateur tape
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const performSearch = () => {
    setIsSearching(true);
    setHasSearched(true);

    // Utiliser le service de recherche
    const results = searchMusic(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  const toggleTrackSelection = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const playTrack = (track: SharedMusic) => {
    // Safe access to window.musicPlayer
    if (typeof window !== 'undefined' && window.musicPlayer) {
      window.musicPlayer.playTrack(track);
      toast.success(`Lecture de ${track.title}`, {
        description: `Par ${track.artist}`,
      });
    }
  };

  const addToQueue = () => {
    // Sélectionner les morceaux
    const tracksToAdd = searchResults.filter(track => selectedTracks.includes(track.id));

    // Simuler l'ajout à la file d'attente
    toast.success(`${selectedTracks.length} morceau(x) ajouté(s) à la file d'attente`);
    setSelectedTracks([]);

    // Jouer le premier morceau
    if (tracksToAdd.length > 0 && typeof window !== 'undefined' && window.musicPlayer) {
      playTrack(tracksToAdd[0]);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="rounded-2xl neo-morphism overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSearch} className="flex items-center space-x-2 p-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher des titres, artistes, utilisateurs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-11 rounded-lg border-muted"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={isSearching || !searchQuery.trim()}
            className="h-11 px-6 rounded-lg font-medium"
          >
            {isSearching ? 'Recherche...' : 'Rechercher'}
          </Button>
        </form>
      </motion.div>

      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">
                Résultats {searchResults.length > 0 && `(${searchResults.length})`}
              </h3>

              {selectedTracks.length > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={addToQueue}
                  className="rounded-full h-8 px-3 text-xs font-medium bg-primary/90"
                >
                  Ajouter {selectedTracks.length} à la file
                </Button>
              )}
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-border overflow-hidden shadow-subtle p-10 text-center">
                <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <h4 className="text-lg font-medium mb-2">Aucun résultat trouvé</h4>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Aucun morceau ne correspond à votre recherche "{searchQuery}". Essayez avec
                  d'autres termes.
                </p>
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-border overflow-hidden shadow-subtle">
                <div className="divide-y divide-border">
                  {searchResults.map(result => (
                    <motion.div
                      key={result.id}
                      className={cn(
                        'flex items-center p-3 hover:bg-secondary/30 transition-colors',
                        selectedTracks.includes(result.id) && 'bg-primary/5'
                      )}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.025)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="relative group h-12 w-12 rounded-md overflow-hidden shadow-sm">
                          <img
                            src={
                              result.coverArt ??
                              'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300'
                            }
                            alt={result.title}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer focus:opacity-100 focus:bg-black/40 outline-none"
                            onClick={() => playTrack(result)}
                            aria-label={`Lire ${result.title} par ${result.artist}`}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                playTrack(result);
                              }
                            }}
                          >
                            <Play className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-grow min-w-0">
                        <h4 className="font-medium text-sm truncate">{result.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                          {result.artist}
                          <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 opacity-70" />
                            {result.duration}
                          </span>
                          <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3 opacity-70" />
                            {result.uploadedByName}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 ml-2">
                        <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 bg-secondary/50 rounded-full flex items-center">
                          {result.plays} écoute{result.plays !== 1 ? 's' : ''}
                        </span>

                        <button
                          className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => toggleTrackSelection(result.id)}
                        >
                          {selectedTracks.includes(result.id) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicSearch;
