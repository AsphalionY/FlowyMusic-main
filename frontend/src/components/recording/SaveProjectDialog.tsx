import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Music, Loader2, ListMusic, Share2, Image, UploadCloud, Globe } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroupSingle, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from '@/hooks/use-toast';

interface SaveProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  isSaving: boolean;
  onSave: () => void;
  // Pour gérer les actions après la sauvegarde
  onMakePublic?: (projectData: SavedProjectData) => void;
}

const musicStyles = [
  'Pop',
  'Rock',
  'Jazz',
  'Classique',
  'Hip-Hop',
  'Électronique',
  'R&B',
  'Folk',
  'Autre',
];

const compositionTypes = ['A cappella', 'Instrumentale', 'Mixte'];

// Interface pour représenter les données du projet sauvegardé
interface SavedProjectData {
  title: string;
  style: string;
  composition: string;
  coverImage: File | null;
  allowReuse: boolean;
}

const SaveProjectDialog = ({
  open,
  onOpenChange,
  projectTitle,
  setProjectTitle,
  isSaving,
  onSave,
  onMakePublic,
}: SaveProjectDialogProps) => {
  // Initialisation des valeurs par défaut pour selectedStyle et selectedComposition
  const [selectedStyle, setSelectedStyle] = useState<string>('Pop'); // Valeur par défaut
  const [selectedComposition, setSelectedComposition] = useState<string>('A cappella'); // Valeur par défaut
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [allowReuse, setAllowReuse] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Gestionnaire pour afficher le toast après la sauvegarde
  useEffect(() => {
    if (justSaved) {
      // Assembler les données du projet
      const projectData: SavedProjectData = {
        title: projectTitle,
        style: selectedStyle,
        composition: selectedComposition,
        coverImage: coverImage,
        allowReuse: allowReuse,
      };
      
      // Montrer le toast avec option de rendre public
      toast({
        title: "Musique sauvegardée",
        description: "Souhaitez-vous rendre cette musique publique dans la bibliothèque ?",
        action: (
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleMakePublic(projectData)}
              className="flex items-center gap-1.5 border-green-500 text-green-600 hover:bg-green-50"
            >
              <Globe className="h-3.5 w-3.5" />
              Oui
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => console.log("Non, garder privé")}
            >
              Non
            </Button>
          </div>
        ),
      });
      
      // Réinitialiser justSaved
      setJustSaved(false);
    }
  }, [justSaved, projectTitle, selectedStyle, selectedComposition, coverImage, allowReuse]);
  
  // Fonction pour gérer la sauvegarde
  const handleSave = () => {
    // Appeler la fonction de sauvegarde existante
    onSave();
    
    // Marquer comme venant d'être sauvegardé pour déclencher le toast
    setJustSaved(true);
  };
  
  // Fonction pour gérer la publication
  const handleMakePublic = (projectData: SavedProjectData) => {
    // Si une fonction de rappel est fournie, l'appeler avec les données du projet
    if (onMakePublic) {
      onMakePublic(projectData);
    } else {
      // Sinon, juste logger l'action pour le moment
      console.log("Musique rendue publique", projectData);
      toast({
        title: "Musique publiée",
        description: "Votre musique est maintenant disponible dans la bibliothèque publique.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Sauvegarder le projet
          </DialogTitle>
          <DialogDescription>Définissez les informations de votre projet musical</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre du projet</Label>
            <Input
              id="title"
              value={projectTitle || ''} // S'assurer que ce n'est jamais undefined
              onChange={e => setProjectTitle(e.target.value)}
              placeholder="Donnez un titre à votre création"
              className="col-span-3"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover" className="flex items-center gap-2">
              <Image className="h-4 w-4 text-primary" />
              Image de couverture
            </Label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative w-full aspect-square max-w-[200px] rounded-lg overflow-hidden bg-secondary/20">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu de la couverture" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full max-w-[200px] aspect-square rounded-lg border-2 border-dashed border-primary/40 hover:border-primary transition-colors cursor-pointer bg-secondary/10"
                >
                  <UploadCloud className="h-8 w-8 text-primary/60" />
                  <p className="text-sm text-muted-foreground mt-2">Cliquez pour ajouter une image</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                id="cover"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCoverImage(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label className="flex items-center gap-2">
              <Music className="h-4 w-4 text-primary" />
              Style musical
            </Label>
            <ToggleGroupSingle
              value={selectedStyle}
              onValueChange={setSelectedStyle}
              className="flex flex-wrap gap-2"
            >
              {musicStyles.map(style => (
                <ToggleGroupItem
                  key={style}
                  value={style}
                  variant="outline"
                  className="flex-1 min-w-[6rem] justify-start"
                  size="sm"
                >
                  {style}
                </ToggleGroupItem>
              ))}
            </ToggleGroupSingle>
          </div>

          <div className="grid gap-3">
            <Label className="flex items-center gap-2">
              <ListMusic className="h-4 w-4 text-primary" />
              Composition musicale
            </Label>
            <ToggleGroupSingle
              value={selectedComposition}
              onValueChange={setSelectedComposition}
              className="flex flex-wrap gap-2"
            >
              {compositionTypes.map(type => (
                <ToggleGroupItem
                  key={type}
                  value={type}
                  variant="outline"
                  className="flex-1 justify-start"
                  size="sm"
                >
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroupSingle>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="reuse" 
              checked={allowReuse}
              onCheckedChange={(checked) => setAllowReuse(checked === true)}
            />
            <Label htmlFor="reuse" className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              Autoriser la réutilisation par la communauté
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="w-full gap-2"
            disabled={isSaving || !projectTitle || !selectedStyle || !selectedComposition}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Music className="h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveProjectDialog;
