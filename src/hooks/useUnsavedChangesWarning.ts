import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseUnsavedChangesWarningProps {
  onSave: () => void;
}

/**
 * Hook pour détecter les tentatives de navigation lorsqu'il y a des changements non sauvegardés
 * et afficher une boîte de dialogue de confirmation.
 */
const useUnsavedChangesWarning = ({ onSave }: UseUnsavedChangesWarningProps) => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isBlockingNavigation, setIsBlockingNavigation] = useState(false);

  // Intercepter la navigation du navigateur (bouton retour, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isBlockingNavigation) {
        e.preventDefault(); // Modern browsers use this to show the confirmation dialog

        // For older browsers (Chrome/Edge < 119) that don't fully support preventDefault() in beforeunload
        // We need to set returnValue as a fallback (the content is ignored by browsers)
        // @ts-ignore: TypeScript flags e.returnValue as deprecated, which is correct but we need it for compatibility
        e.returnValue = ''; // Empty string is the standard practice for cross-browser compatibility

        return true; // For very old browsers that require a return value
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlockingNavigation]);

  // Activer le blocage de navigation
  const enableNavigationBlocking = useCallback(() => {
    setIsBlockingNavigation(true);
  }, []);

  // Désactiver le blocage de navigation
  const disableNavigationBlocking = useCallback(() => {
    setIsBlockingNavigation(false);
  }, []);

  // Fonction pour naviguer directement sans confirmation
  const navigateWithoutConfirmation = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  // Fonction pour naviguer avec confirmation si nécessaire
  const navigateWithConfirmation = useCallback(
    (path: string) => {
      if (isBlockingNavigation) {
        setPendingNavigation(path);
        setShowDialog(true);
      } else {
        navigate(path);
      }
    },
    [isBlockingNavigation, navigate]
  );

  // Fonction pour confirmer la navigation sans sauvegarder
  const confirmNavigation = useCallback(() => {
    setShowDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [navigate, pendingNavigation]);

  // Fonction pour sauvegarder puis naviguer
  const saveAndNavigate = useCallback(() => {
    onSave();
    setShowDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [navigate, onSave, pendingNavigation]);

  // Fonction pour annuler la navigation
  const cancelNavigation = useCallback(() => {
    setShowDialog(false);
    setPendingNavigation(null);
  }, []);

  return {
    showDialog,
    pendingNavigation,
    isBlockingNavigation,
    enableNavigationBlocking,
    disableNavigationBlocking,
    navigateWithoutConfirmation,
    navigateWithConfirmation,
    confirmNavigation,
    saveAndNavigate,
    cancelNavigation,
  };
};

export default useUnsavedChangesWarning;
