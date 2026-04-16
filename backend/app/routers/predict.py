from fastapi import APIRouter

from app.schemas.predict import (
    BatchPredictRequest,
    BatchPredictResponse,
    PredictRequest,
    PredictResponse,
)
from app.services.inference_service import inference_service

router = APIRouter(tags=["predict"])


@router.post("/predict")
def predict(payload: PredictRequest) -> PredictResponse:
    result = inference_service.predict(payload.features, payload.threshold)
    return PredictResponse(**result)


@router.post("/predict-batch")
def predict_batch(payload: BatchPredictRequest) -> BatchPredictResponse:
    items = [
        PredictResponse(**inference_service.predict(item.features, item.threshold))
        for item in payload.items
    ]
    return BatchPredictResponse(
        items=items,
        count=len(items),
        mode="mock",
    )
