from fastapi import APIRouter, HTTPException
from app.schemas.prediction import PredictRequest, PredictResponse
from app.services.ml_prediction import predict_diseases

router = APIRouter(prefix="/kham_benh", tags=["prediction"])


@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        predictions = predict_diseases(req.symptoms, req.min_probability)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    return PredictResponse(predictions=predictions, threshold=req.min_probability)
