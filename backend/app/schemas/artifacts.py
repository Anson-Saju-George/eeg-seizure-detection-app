from pydantic import BaseModel


class ConfigResponse(BaseModel):
    available: bool
    data: dict | None
    source: str


class HistoryRow(BaseModel):
    epoch: int
    train_loss: float
    train_accuracy: float
    train_f1: float
    train_roc_auc: float
    val_accuracy: float
    val_f1: float
    val_roc_auc: float
    lr: float


class PredictionRow(BaseModel):
    true_label: int
    pred_probability: float
    pred_label: int


class HistoryResponse(BaseModel):
    available: bool
    count: int
    data: list[HistoryRow]
    source: str


class PredictionResponse(BaseModel):
    available: bool
    count: int
    data: list[PredictionRow]
    source: str


class ThresholdRow(BaseModel):
    threshold: float
    tp: int
    tn: int
    fp: int
    fn: int
    precision: float
    recall: float
    f1: float
    balanced_accuracy: float


class ThresholdResponse(BaseModel):
    available: bool
    count: int
    data: list[ThresholdRow]
    source: str
