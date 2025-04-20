
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, FileMusic, ChevronRight } from 'lucide-react';
import UserNav from './UserNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="wave-pattern absolute inset-x-0 h-40 top-0 opacity-70"></div>
        <div className="wave-pattern absolute inset-x-0 h-40 bottom-0 opacity-70 rotate-180"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-300/10 via-transparent to-blue-300/10 animate-flow"></div>
      </div>
      
      <header className="sticky top-0 z-30 w-full border-b border-white/20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20 overflow-hidden">
              <div className="absolute inset-0 bg-white/10"></div>
              <Music className="h-5 w-5 text-white relative z-10" />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-spin-slow"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Flowy</span>
              <span className="text-xs text-muted-foreground -mt-1">Music Creation</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/shared-music" className="hidden md:block">
              <Button 
                variant={location.pathname === "/shared-music" ? "default" : "outline"}
                size="sm" 
                className="md:flex items-center gap-1 text-xs rounded-full px-4 relative overflow-hidden group"
              >
                <FileMusic className="h-4 w-4" />
                <span className="relative z-10">Bibliothèque</span>
                <ChevronRight className="h-3 w-3 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity -z-0"></div>
              </Button>
            </Link>
            
            <UserNav />
          </div>
        </div>
      </header>
      
      <main className="container py-6 md:py-8 px-4 md:px-6 lg:px-8 relative z-10 mx-auto max-w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
