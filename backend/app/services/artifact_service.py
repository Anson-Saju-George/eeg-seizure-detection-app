import csv
import json
from pathlib import Path

from app.core.config import settings


class ArtifactService:
    def _resolve(self, file_name: str) -> Path:
        candidates = [
            settings.public_data_dir / file_name,
            settings.local_artifacts_dir / file_name,
        ]

        for candidate in candidates:
            if candidate.exists():
                return candidate

        return candidates[0]

    def load_json(self, file_name: str) -> tuple[bool, dict | None, str]:
        path = self._resolve(file_name)
        if not path.exists():
            return False, None, str(path)

        with path.open("r", encoding="utf-8") as handle:
            return True, json.load(handle), str(path)

    def load_csv(self, file_name: str) -> tuple[bool, list[dict[str, str]], str]:
        path = self._resolve(file_name)
        if not path.exists():
            return False, [], str(path)

        with path.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            return True, list(reader), str(path)


artifact_service = ArtifactService()
