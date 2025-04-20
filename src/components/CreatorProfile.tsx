
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Play, 
  Clock, 
  Calendar, 
  Music, 
  Users,
  Bell,
  BellOff,
  MessageSquare,
  Headphones,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface CreatorProfileProps {
  className?: string;
}

const CreatorProfile = ({ className }: CreatorProfileProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.info(isFollowing ? "Vous ne suivez plus ce créateur" : "Vous suivez maintenant ce créateur");
    setIsNotified(false);
  };

  const handleNotification = () => {
    if (!isFollowing) {
      setIsFollowing(true);
      setIsNotified(true);
      toast.success("Notifications activées pour ce créateur");
    } else {
      setIsNotified(!isNotified);
      if (!isNotified) {
        toast.success("Notifications activées pour ce créateur");
      } else {
        toast.info("Notifications désactivées pour ce créateur");
      }
    }
  };

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
