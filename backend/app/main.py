from fastapi import FastAPI

app = FastAPI(
    title="RecoverIQ API",
    description="File recovery and reconstruction engine",
    version="1.0.0"
)


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