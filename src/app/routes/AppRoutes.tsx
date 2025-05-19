import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import Layout from '../../components/Layout';

// Import des pages par fonctionnalité
import Auth from '../../pages/Auth';
import CreateProfile from '../../pages/CreateProfile';
import Profile from '../../pages/Profile';
import Index from '../../pages/Index';
import SharedMusic from '../../pages/SharedMusic';
import NotFound from '../../pages/NotFound';

/**
 * Configuration des routes principales de l'application
 */
export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Layout>
            <Index />
          </Layout>
        } 
      />

      <Route path="/auth" element={<Auth />} />
      
      <Route 
        path="/create-profile" 
        element={
          isAuthenticated ? (
            <CreateProfile />
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
      
      <Route 
        path="/profile/:id?" 
        element={
          isAuthenticated ? (
            <Layout>
              <Profile />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
      
      <Route 
        path="/shared/:id" 
        element={
          <Layout>
            <SharedMusic />
          </Layout>
        } 
      />
      
      {/* Route par défaut pour les chemins non trouvés */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
