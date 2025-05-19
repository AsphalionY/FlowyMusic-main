
# Configuration settings for the audio backend service
import os
import tempfile

# Répertoire pour les fichiers temporaires
TEMP_DIR = os.path.join(tempfile.gettempdir(), "audio-processing")
os.makedirs(TEMP_DIR, exist_ok=True)

# État des tâches en cours
processing_tasks = {}
