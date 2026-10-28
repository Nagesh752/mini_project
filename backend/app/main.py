from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.mongodb import db_manager
from app.services.product_service import get_all_products, get_product_by_id

from app.routes.auth import router as auth_router
from app.routes.search import router as search_router
from app.routes.wishlist import router as wishlist_router
from app.routes.compare import router as compare_router
from app.routes.history import router as history_router
from app.routes.feedback import router as feedback_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to database
    await db_manager.connect()
    yield
    # Shutdown: Close database connection
    await db_manager.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ShopMind AI — AI-powered shopping assistant and product comparison platform backend API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(search_router, prefix=settings.API_PREFIX)
app.include_router(wishlist_router, prefix=settings.API_PREFIX)
app.include_router(compare_router, prefix=settings.API_PREFIX)
app.include_router(history_router, prefix=settings.API_PREFIX)
app.include_router(feedback_router, prefix=settings.API_PREFIX)

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "online",
        "version": settings.VERSION,
        "database": "mongodb" if not db_manager.use_fallback else "resilient_local_storage",
        "service": "ShopMind AI Backend"
    }

@app.get("/api/products", tags=["Products"])
async def get_catalog():
    return {"products": get_all_products()}

@app.get("/api/products/{product_id}", tags=["Products"])
async def get_single_product(product_id: str):
    p = get_product_by_id(product_id)
    if not p:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return p

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
