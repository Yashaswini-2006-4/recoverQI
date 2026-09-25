from fastapi import FastAPI

from app.api.recovery_routes import router as recovery_router


app = FastAPI(
    title="RecoverIQ API",
    description="File recovery and reconstruction engine",
    version="1.0.0"
)


app.include_router(recovery_router)


@app.get("/")
def root():
    return {
        "project": "RecoverIQ",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }