
# Models package for audio processing models
import torch
import logging

logger = logging.getLogger("audio-processing-service")

# Fonction pour vérifier si CUDA est disponible
def is_cuda_available():
    return torch.cuda.is_available()

# Chargement des modèles (importé ici pour être accessible à tous les modules)
from .model_loader import load_models, models
