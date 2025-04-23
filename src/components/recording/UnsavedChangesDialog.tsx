import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Save, XCircle } from 'lucide-react';

interface UnsavedChangesDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  onQuit: () => void;
}

/**
 * Boîte de dialogue de confirmation pour les changements non sauvegardés
 */
const UnsavedChangesDialog = ({
  open,
  onClose,
  onSave,
  onQuit
}: UnsavedChangesDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Changements non sauvegardés</AlertDialogTitle>
          <AlertDialogDescription>
            Vous avez des pistes non sauvegardées. Que souhaitez-vous faire ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={onQuit}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Quitter
          </Button>
          <Button 
            variant="default" 
            onClick={onSave}
            className="flex items-center gap-2 bg-primary"
          >
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsavedChangesDialog;
