import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseUnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
  onSave: () => void;
}

/**
 * Hook pour détecter les tentatives de navigation lorsqu'il y a des changements non sauvegardés
 * et afficher une boîte de dialogue de confirmation.
 */
const useUnsavedChangesWarning = ({ 
  hasUnsavedChanges, 
  onSave 
}: UseUnsavedChangesWarningProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Intercepter la navigation du navigateur (bouton retour, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Fonction pour naviguer vers une autre page
  const navigateTo = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowDialog(true);
    } else {
      navigate(path);
    }
  };

  // Fonction pour confirmer la navigation sans sauvegarder
  const confirmNavigation = () => {
    setShowDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  // Fonction pour sauvegarder puis naviguer
  const saveAndNavigate = () => {
    onSave();
    setShowDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  // Fonction pour annuler la navigation
  const cancelNavigation = () => {
    setShowDialog(false);
    setPendingNavigation(null);
  };

  return {
    navigateTo,
    showDialog,
    pendingNavigation,
    confirmNavigation,
    saveAndNavigate,
    cancelNavigation
  };
};

export default useUnsavedChangesWarning;
