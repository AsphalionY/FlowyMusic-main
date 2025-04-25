import { useState } from 'react';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SaveProjectDialog from './SaveProjectDialog';

interface ProjectControlsProps {
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  handleSaveProject: () => void;
  isSaving: boolean;
  musicTracks: any[];
}

const ProjectControls = ({
  projectTitle,
  setProjectTitle,
  handleSaveProject,
  isSaving,
  musicTracks,
}: ProjectControlsProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  return (
    <>
      <div className="pt-4 flex">
        <Button
          onClick={() => setSaveDialogOpen(true)}
          className="w-full gap-2"
          disabled={musicTracks.length === 0}
        >
          <Music className="h-4 w-4" />
          Sauvegarder le projet
        </Button>
      </div>

      <SaveProjectDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        isSaving={isSaving}
        onSave={handleSaveProject}
      />
    </>
  );
};

export default ProjectControls;
