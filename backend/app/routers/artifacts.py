from fastapi import APIRouter

from app.schemas.artifacts import (
    ConfigResponse,
    HistoryResponse,
    HistoryRow,
    PredictionResponse,
    PredictionRow,
    ThresholdResponse,
    ThresholdRow,
)
from app.services.artifact_service import artifact_service

router = APIRouter(prefix="/artifacts", tags=["artifacts"])

@router.get("/config")
def get_config() -> ConfigResponse:
    available, data, source = artifact_service.load_json("config.json")
    return ConfigResponse(available=available, data=data, source=source)


@router.get("/history")
def get_history() -> HistoryResponse:
    available, rows, source = artifact_service.load_csv("history.csv")
    normalized = [
        HistoryRow(
            epoch=int(float(row["epoch"])),
            train_loss=float(row["train_loss"]),
            train_accuracy=float(row["train_accuracy"]),
            train_f1=float(row["train_f1"]),
            train_roc_auc=float(row["train_roc_auc"]),
            val_accuracy=float(row["val_accuracy"]),
            val_f1=float(row["val_f1"]),
            val_roc_auc=float(row["val_roc_auc"]),
            lr=float(row["lr"]),
        )
        for row in rows
    ]
    return HistoryResponse(
        available=available,
        count=len(normalized),
        data=normalized,
        source=source,
    )


@router.get("/test-predictions")
def get_test_predictions() -> PredictionResponse:
    available, rows, source = artifact_service.load_csv("test_predictions.csv")
    normalized = [
        PredictionRow(
            true_label=int(float(row["true_label"])),
            pred_probability=float(row["pred_probability"]),
            pred_label=int(float(row["pred_label"])),
        )
        for row in rows
    ]
    return PredictionResponse(
        available=available,
        count=len(normalized),
        data=normalized,
        source=source,
    )


@router.get("/threshold-table")
def get_threshold_table() -> ThresholdResponse:
    available, rows, source = artifact_service.load_csv("threshold_table.csv")
    normalized = [
        ThresholdRow(
            threshold=float(row["threshold"]),
            tp=int(float(row["tp"])),
            tn=int(float(row["tn"])),
            fp=int(float(row["fp"])),
            fn=int(float(row["fn"])),
            precision=float(row["precision"]),
            recall=float(row["recall"]),
            f1=float(row["f1"]),
            balanced_accuracy=float(
                row.get("balanced_accuracy", row.get("balancedAccuracy", 0.0))
            ),
        )
        for row in rows
    ]
    return ThresholdResponse(
        available=available,
        count=len(normalized),
        data=normalized,
        source=source,
    )
