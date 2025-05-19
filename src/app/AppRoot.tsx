import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from '../shared/components/toaster';
import { SupabaseAuthProvider } from '../contexts/SupabaseAuthProvider';

/**
 * Composant racine de l'application
 * Gère les providers globaux et le routage principal
 */
const AppRoot: React.FC = () => {
  return (
    <SupabaseAuthProvider>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </SupabaseAuthProvider>
  );
};

export default AppRoot;
