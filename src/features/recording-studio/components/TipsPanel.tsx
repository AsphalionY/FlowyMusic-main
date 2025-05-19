import React from 'react';
import { AlertCircle } from 'lucide-react';

const TipsPanel = () => {
  return (
    <div className="mt-6 space-y-4">
      {/* Recording Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">Conseils pour créer votre musique</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Cliquez sur le micro pour commencer à enregistrer</li>
            <li>Acceptez la demande d'autorisation du microphone de votre navigateur</li>
            <li>Importez des sons ou de la musique pour les mixer</li>
            <li>Donnez un titre à votre projet avant de le sauvegarder</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TipsPanel;
