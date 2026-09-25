from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.recovery_routes import router as recovery_router

app = FastAPI(
    title="RecoverIQ API",
    description="File recovery and reconstruction engine",
    version="1.0.0"
)

# Enable CORS for Vite frontend dev server (port 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.recovery_routes import router as recovery_router

from app.api.recovery_routes import router as recovery_router


app = FastAPI(
    title="RecoverIQ API",
    description="File recovery and reconstruction engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recovery_router)


app.include_router(recovery_router)


@app.get("/")
def root():
    return {
        "project": "RecoverIQ",
        "status": "running",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
