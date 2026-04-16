from pathlib import Path


class Settings:
    app_name: str = "Seizure Monitoring Demo API"
    public_data_dir: Path = Path(__file__).resolve().parents[3] / "public" / "data"
    local_artifacts_dir: Path = Path(__file__).resolve().parents[1] / "artifacts"


settings = Settings()
