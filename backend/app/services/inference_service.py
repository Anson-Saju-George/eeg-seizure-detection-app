import math
from typing import Any

from app.services.artifact_service import artifact_service


def _clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def _mulberry32(seed: int):
    state = seed & 0xFFFFFFFF

    def next_random() -> float:
        nonlocal state
        state = (state + 0x6D2B79F5) & 0xFFFFFFFF
        t = state
        t = (t ^ (t >> 15)) * (t | 1)
        t &= 0xFFFFFFFF
        t ^= t + ((t ^ (t >> 7)) * (t | 61) & 0xFFFFFFFF)
        t &= 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return next_random


class InferenceService:
    def _load_config(self) -> dict[str, Any]:
        available, data, _source = artifact_service.load_json("config.json")
        if available and data:
          return data
        return {
            "input_dim": 178,
            "best_threshold": 0.63,
            "seed": 42,
        }

    def _build_weights(self, input_dim: int, seed: int) -> list[float]:
        random = _mulberry32(seed)
        weights: list[float] = []
        for index in range(input_dim):
            base = (random() - 0.5) * 0.9
            shaped = math.sin((index + 1) * 0.19) * 0.3 + base
            weights.append(shaped)
        return weights

    def _confidence_band(self, probability: float) -> str:
        if probability >= 0.75:
            return "High"
        if probability >= 0.4:
            return "Medium"
        return "Low"

    def predict(self, features: list[float], threshold: float | None = None) -> dict[str, Any]:
        config = self._load_config()
        input_dim = int(config.get("input_dim", 178))
        seed = int(config.get("seed", 42))
        resolved_threshold = (
            float(threshold)
            if threshold is not None
            else float(config.get("best_threshold", 0.63))
        )

        padded = list(features[:input_dim])
        if len(padded) < input_dim:
            padded.extend([0.5] * (input_dim - len(padded)))

        weights = self._build_weights(input_dim, seed)
        centered = [value - 0.5 for value in padded]
        weighted = sum(value * weights[index] for index, value in enumerate(centered))
        energy = sum(abs(value) for value in centered) / input_dim
        signal = weighted / math.sqrt(input_dim) + energy * 1.8 - 0.15
        probability = _clamp(1 / (1 + math.exp(-signal)))

        return {
            "probability": probability,
            "label": 1 if probability >= resolved_threshold else 0,
            "threshold": resolved_threshold,
            "confidence_band": self._confidence_band(probability),
            "mode": "mock",
            "detail": "Deterministic mock inference is active. Real PyTorch inference is not enabled on this backend yet.",
        }


inference_service = InferenceService()
