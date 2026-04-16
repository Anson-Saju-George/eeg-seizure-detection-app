from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    features: list[float] = Field(default_factory=list)
    threshold: float | None = None


class BatchPredictRequest(BaseModel):
    items: list[PredictRequest] = Field(default_factory=list)


class PredictResponse(BaseModel):
    probability: float
    label: int
    threshold: float
    confidence_band: str
    mode: str
    detail: str | None = None


class BatchPredictResponse(BaseModel):
    items: list[PredictResponse]
    count: int
    mode: str
