import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatorProfileProps {
  className?: string;
}

const CreatorProfile = ({ className }: CreatorProfileProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center py-8">
        <div className="mx-auto bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">Aucun profil disponible</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Le profil du créateur apparaîtra ici une fois qu'il sera disponible.
        </p>
      </div>
    </div>
  );
};

export default CreatorProfile;
