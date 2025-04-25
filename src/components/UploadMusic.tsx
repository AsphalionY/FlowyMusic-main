import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AuthRequired from './upload/AuthRequired';
import FileDropzone from './upload/FileDropzone';
import FileDetails from './upload/FileDetails';
import CopyrightNotice from './upload/CopyrightNotice';
import { useUploadMusic } from './upload/useUploadMusic';

interface UploadMusicProps {
  className?: string;
}

const UploadMusic = ({ className }: UploadMusicProps) => {
  const {
    isAuthenticated,
    user,
    selectedFile,
    isUploading,
    uploadProgress,
    title,
    redirectToLogin,
    handleFileSelected,
    removeFile,
    handleTitleChange,
    handleSubmit,
  } = useUploadMusic();

  // Afficher un message si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return <AuthRequired className={cn('max-w-lg mx-auto py-10', className)} />;
  }

  return (
    <div className={cn('max-w-lg mx-auto', className)}>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Ajouter une musique</h2>
        <p className="text-muted-foreground">Partagez vos créations musicales avec la communauté</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl overflow-hidden neo-morphism"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FileDropzone
                  onFileSelected={handleFileSelected}
                  redirectToLogin={redirectToLogin}
                  isAuthenticated={isAuthenticated}
                />
              </motion.div>
            ) : (
              <motion.div
                key="file-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FileDetails
                  file={selectedFile}
                  title={title}
                  onTitleChange={handleTitleChange}
                  onRemoveFile={removeFile}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  username={user?.username ?? ''}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>

      <CopyrightNotice />
    </div>
  );
};

export default UploadMusic;
