
# Task management routes for async processing
from fastapi import APIRouter
from fastapi.responses import JSONResponse, FileResponse
import os
import logging

from ..config import processing_tasks

logger = logging.getLogger("audio-processing-service")
router = APIRouter(prefix="/api", tags=["tasks"])

@router.get("/task/{task_id}")
async def get_task_status(task_id: str):
    if task_id not in processing_tasks:
        return JSONResponse(
            status_code=404,
            content={"error": "Tâche non trouvée"}
        )
    
    task_info = processing_tasks[task_id]
    
    # Si la tâche est terminée et qu'il y a un fichier de sortie, préparer le téléchargement
    if task_info["status"] == "completed" and "output_file" in task_info:
        output_file = task_info["output_file"]
        if os.path.exists(output_file):
            task_info["download_url"] = f"/api/download/{task_id}"
    
    return task_info

@router.get("/download/{task_id}")
async def download_processed_file(task_id: str):
    if task_id not in processing_tasks:
        return JSONResponse(
            status_code=404,
            content={"error": "Tâche non trouvée"}
        )
    
    task_info = processing_tasks[task_id]
    
    if task_info["status"] != "completed" or "output_file" not in task_info:
        return JSONResponse(
            status_code=400,
            content={"error": "Le fichier n'est pas encore prêt"}
        )
    
    output_file = task_info["output_file"]
    
    if not os.path.exists(output_file):
        return JSONResponse(
            status_code=404,
            content={"error": "Fichier non trouvé"}
        )
    
    # Déterminer le type de fichier
    filename = os.path.basename(output_file)
    media_type = "audio/wav" if filename.endswith(".wav") else "application/octet-stream"
    
    return FileResponse(
        output_file, 
        media_type=media_type,
        filename=filename
    )
