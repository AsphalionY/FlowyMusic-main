
import React from 'react';
import { AlertCircle } from 'lucide-react';

const CopyrightNotice = () => {
  return (
    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex items-start space-x-3">
      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium mb-1">Droits d'auteur</p>
        <p>Veuillez vous assurer que vous possédez les droits sur la musique que vous partagez ou qu'elle est libre de droits.</p>
      </div>
    </div>
  );
};

export default CopyrightNotice;
