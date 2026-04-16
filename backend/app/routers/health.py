from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "mode": "research-demo",
        "note": "Research/demo simulator only. Not for clinical use.",
    }
