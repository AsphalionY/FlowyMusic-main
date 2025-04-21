import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth, MusicCategory } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Check, Music, User } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

const musicCategories = [
  { id: 'rap', label: 'Rap' },
  { id: 'rock', label: 'Rock' },
  { id: 'pop', label: 'Pop' },
  { id: 'electro', label: 'Électronique' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'classique', label: 'Classique' },
  { id: 'autre', label: 'Autre' },
];

const profileSchema = z.object({
  bio: z.string().max(300, "La biographie ne doit pas dépasser 300 caractères"),
  profileImage: z.string().optional(),
  preferredCategories: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const CreateProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading, isAuthenticated } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    user?.preferredCategories as string[] || []
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: user?.bio || "",
      profileImage: user?.profileImage || "",
      preferredCategories: user?.preferredCategories || [],
    },
  });

  // Rediriger si non authentifié
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Délai de téléchargement
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImagePreview(base64String);
          form.setValue('profileImage', base64String);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
    
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
      
    form.setValue('preferredCategories', updatedCategories);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    const formData = {
      ...data,
      preferredCategories: selectedCategories as MusicCategory[],
    };
    
    if (await updateProfile(formData)) {
      toast.success('Profil mis à jour avec succès');
      navigate('/profile');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Fonction pour valider et nettoyer les URLs d'images
  const sanitizeImageUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    
    try {
      // Vérifier que l'URL est valide
      const parsedUrl = new URL(url);
      
      // Vérifier que c'est une URL d'image
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const isImage = imageExtensions.some(ext => 
        parsedUrl.pathname.toLowerCase().endsWith(ext)
      );
      
      if (!isImage) return null;
      
      // Vérifier que le protocole est sécurisé
      if (parsedUrl.protocol !== 'https:') return null;
      
      return url;
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        className="w-full max-w-md mx-auto py-6 px-4 md:px-0 md:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Votre profil</h1>
          <p className="text-muted-foreground mt-2">Personnalisez votre profil et vos préférences</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-border p-4 md:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 overflow-hidden rounded-full bg-secondary relative">
                    {(imagePreview || user?.profileImage) ? (
                      <img 
                        src={sanitizeImageUrl(imagePreview || user?.profileImage) || ''} 
                        alt="Aperçu du profil" 
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <FormItem>
                    <FormLabel className="cursor-pointer">
                      <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                        <Upload className="mr-2 h-4 w-4" />
                        Choisir une photo
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                        disabled={isUploading}
                      />
                    </FormLabel>
                  </FormItem>
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biographie</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Parlez-nous un peu de vous et de votre musique..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/300 caractères
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Catégories musicales préférées</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {musicCategories.map((category) => (
                      <div
                        key={category.id}
                        className={`flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer transition-colors ${
                          selectedCategories.includes(category.id)
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }`}
                        onClick={() => handleCategoryToggle(category.id)}
                      >
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                          id={`category-${category.id}`}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default CreateProfile;
