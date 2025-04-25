import { useState } from 'react';
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
import { Music, Loader2, ListMusic, Share2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SaveProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  isSaving: boolean;
  onSave: () => void;
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

const SaveProjectDialog = ({
  open,
  onOpenChange,
  projectTitle,
  setProjectTitle,
  isSaving,
  onSave,
}: SaveProjectDialogProps) => {
  // Initialisation des valeurs par défaut pour selectedStyle et selectedComposition
  const [selectedStyle, setSelectedStyle] = useState<string>('Pop'); // Valeur par défaut
  const [selectedComposition, setSelectedComposition] = useState<string>('A cappella'); // Valeur par défaut

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

          <div className="grid gap-3">
            <Label className="flex items-center gap-2">
              <Music className="h-4 w-4 text-primary" />
              Style musical
            </Label>
            <ToggleGroup
              type="single"
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
            </ToggleGroup>
          </div>

          <div className="grid gap-3">
            <Label className="flex items-center gap-2">
              <ListMusic className="h-4 w-4 text-primary" />
              Composition musicale
            </Label>
            <ToggleGroup
              type="single"
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
            </ToggleGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="reuse" />
            <Label htmlFor="reuse" className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              Autoriser la réutilisation par la communauté
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onSave}
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
