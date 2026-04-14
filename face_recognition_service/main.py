import os
import shutil
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from deepface import DeepFace

app = FastAPI(title="Servicio de Reconocimiento Facial", version="1.0")

UPLOAD_DIR = "/app/temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"status": "Microservicio de Reconocimiento Facial Online"}

@app.post("/verify")
async def verify_faces(
    reference_image: UploadFile = File(...),
    current_image: UploadFile = File(...)
):
    try:
        # Guardamos ambas fotos temporalmente en el disco del contenedor
        ref_path = os.path.join(UPLOAD_DIR, f"ref_{reference_image.filename}")
        curr_path = os.path.join(UPLOAD_DIR, f"curr_{current_image.filename}")
        
        with open(ref_path, "wb") as buffer:
            shutil.copyfileobj(reference_image.file, buffer)
            
        with open(curr_path, "wb") as buffer:
            shutil.copyfileobj(current_image.file, buffer)

        # Usar libreria DeepFace para verificar
        # enforce_detection a False permite que no explote si la imagen está borrosa
        result = DeepFace.verify(
            img1_path=ref_path,
            img2_path=curr_path,
            model_name="VGG-Face",
            distance_metric="cosine",
            enforce_detection=False
        )
        
        # Limpieza de archivos despues de comparar
        if os.path.exists(ref_path): os.remove(ref_path)
        if os.path.exists(curr_path): os.remove(curr_path)
        
        return JSONResponse(content={
            "verified": bool(result.get("verified", False)),
            "distance": float(result.get("distance", 1.0)),
            # Normalizamos un score de similitud 
            "similarity": round(float(1.0 - result.get("distance", 1.0)) * 100, 2), 
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
