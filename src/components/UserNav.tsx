import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Music } from 'lucide-react';

const UserNav = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-4 hover:bg-primary/10"
          onClick={() => navigate('/auth')}
          data-testid="login-button"
        >
          Connexion
        </Button>
        <Button
          variant="default"
          size="sm"
          className="rounded-full px-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-sm shadow-primary/20"
          onClick={() => navigate('/auth?tab=register')}
        >
          S'inscrire
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profileImage} alt={user?.username} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
              {user?.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-primary"
        align="center"
        alignOffset={-30}
        sideOffset={5}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Mon compte</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/create-profile')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/')}>
          <Music className="mr-2 h-4 w-4" />
          <span>Studio</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
