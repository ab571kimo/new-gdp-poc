import os
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# 匯入 API 路由器
from .api.menu.menu import router as menu_router

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

# --- FastAPI App ---
app = FastAPI(
    title="GDP POC System",
    description="GDP POC 系統 - FastAPI Backend",
    version="001"
)

# --- 註冊 API 路由 ---
app.include_router(menu_router)
logger.info("已註冊 Menu API 路由")

# --- Health Check API ---
@app.get("/api/health")
async def health_check():
    """健康檢查端點"""
    logger.info("Health check at /api/health")
    return {"status": "healthy", "version": "001"}

# --- Static Files Setup ---
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(static_dir, exist_ok=True)

# --- Catch-all for React Routes ---
@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    """處理所有 React 路由，返回 index.html"""
    # 靜態資源檔案
    if "." in full_path:
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path):
            return FileResponse(file_path)
    
    # SPA 路由，返回 index.html
    index_html = os.path.join(static_dir, "index.html")
    if os.path.exists(index_html):
        logger.info(f"Serving React frontend for path: /{full_path}")
        return FileResponse(index_html)
    
    logger.error("Frontend not built. index.html missing.")
    raise HTTPException(
        status_code=404,
        detail="Frontend not built. Please run 'npm run build' first."
    )
