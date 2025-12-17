"""
FastAPI Backend Main Entry
包含選單API路由和靜態檔案服務
"""

import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.api.menu import router as menu_router

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Template Real - Menu Demo App")

# --- API Routes ---
@app.get("/api/health")
async def health_check():
    """健康檢查端點"""
    logger.info("Health check at /api/health")
    return {"status": "healthy"}

# 註冊選單路由
app.include_router(menu_router, prefix="/api/menu", tags=["menu"])

# --- Static Files Setup ---
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(static_dir, exist_ok=True)

# --- Catch-all for React Routes ---
@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    """處理所有React路由和靜態檔案"""
    # 檢查是否為靜態資源（assets 目錄下的檔案）
    if full_path.startswith("assets/"):
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path):
            return FileResponse(file_path)
    
    # 對於所有其他路徑，返回 index.html（React Router 會處理）
    index_html = os.path.join(static_dir, "index.html")
    if os.path.exists(index_html):
        logger.info(f"Serving React frontend for path: /{full_path}")
        return FileResponse(index_html)
    
    logger.error("Frontend not built. index.html missing.")
    raise HTTPException(
        status_code=404,
        detail="Frontend not built. Please run 'npm run build' first."
    )
