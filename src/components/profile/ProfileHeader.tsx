import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileHeaderProps {
  user: {
    username: string;
    email: string;
    profileImage?: string;
    bio?: string;
    tracks?: number;
    followers?: number;
    following?: number;
    preferredCategories?: string[];
  };
  categoryLabels: { [key: string]: string };
  onEditProfile: () => void;
  onLogout: () => void;
}

const ProfileHeader = ({ user, categoryLabels, onEditProfile, onLogout }: ProfileHeaderProps) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-border p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-background">
          <AvatarImage src={user.profileImage} />
          <AvatarFallback className="text-2xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{user.email}</p>
          
          <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start">
            <div className="text-center">
              <p className="text-lg font-semibold">{user.tracks ?? 0}</p>
              <p className="text-xs text-muted-foreground">Morceaux</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{user.followers ?? 0}</p>
              <p className="text-xs text-muted-foreground">Abonnés</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{user.following ?? 0}</p>
              <p className="text-xs text-muted-foreground">Abonnements</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
          <Button onClick={onEditProfile} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button onClick={onLogout} variant="ghost" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
      
      {user.bio && (
        <div className="mt-4 px-0 md:px-4">
          <p className="text-sm text-muted-foreground">{user.bio}</p>
        </div>
      )}
      
      {user.preferredCategories && user.preferredCategories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {user.preferredCategories.map((category) => (
            <Badge key={category} variant="outline" className="bg-primary/5 text-primary border-primary/30">
              {categoryLabels[category] || category}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
