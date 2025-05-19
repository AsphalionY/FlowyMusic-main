
# Status routes for checking server and model status
from fastapi import APIRouter
from ..models import is_cuda_available, models

router = APIRouter(prefix="/api", tags=["status"])

@router.get("/status")
async def get_status():
    return {
        "status": "online",
        "cuda_available": is_cuda_available(),
        "models_loaded": {
            "denoiser": "denoiser" in models,
            "source_separator": "source_separator" in models,
            "quality_restorer": "quality_restorer" in models,
            "vad_model": "vad_model" in models
        }
    }
