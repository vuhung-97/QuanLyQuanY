from pydantic import BaseModel


class PredictRequest(BaseModel):
    symptoms: list[str]
    min_probability: float = 0.0


class PredictResponse(BaseModel):
    predictions: list[dict]
    threshold: float
