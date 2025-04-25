import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, Users } from 'lucide-react';

interface ProfileAboutProps {
  user: {
    username: string;
    createdAt: string;
    preferredCategories?: string[];
  };
  formattedDate: string;
  categoryLabels: { [key: string]: string };
}

const ProfileAbout = ({ user, formattedDate, categoryLabels }: ProfileAboutProps) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-border p-4 md:p-6">
      <h3 className="text-lg font-medium mb-4">Informations du compte</h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Nom d'utilisateur</p>
            <p className="text-muted-foreground">{user.username}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Membre depuis</p>
            <p className="text-muted-foreground">{formattedDate}</p>
          </div>
        </div>

        {user.preferredCategories && user.preferredCategories.length > 0 && (
          <div className="flex items-start gap-3">
            <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Genres préférés</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {user.preferredCategories.map(category => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/30"
                  >
                    {categoryLabels[category] || category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAbout;
