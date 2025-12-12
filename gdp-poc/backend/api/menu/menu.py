import os
import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from databricks import sql

# --- Logging Setup ---
logger = logging.getLogger(__name__)

# --- Router Setup ---
router = APIRouter(prefix="/api/menu", tags=["menu"])


# --- Data Models ---
class Page(BaseModel):
    """頁面資料模型"""
    pageId: str
    pageName: str
    pageNo: int
    iframeId: Optional[str] = None
    pageUrl: Optional[str] = None


class MenuGroup(BaseModel):
    """選單群組資料模型"""
    menuId: str
    menuName: str
    menuNo: int
    pages: List[Page]


class MenuStructureResponse(BaseModel):
    """選單結構回應模型"""
    menuGroups: List[MenuGroup]


class ErrorResponse(BaseModel):
    """錯誤回應模型"""
    error: str
    errorCode: str


# --- API Endpoints ---
@router.get(
    "/structure",
    response_model=MenuStructureResponse,
    responses={
        200: {"model": MenuStructureResponse, "description": "成功取得選單結構"},
        400: {"model": ErrorResponse, "description": "請求錯誤"},
        500: {"model": ErrorResponse, "description": "伺服器錯誤"}
    }
)
async def get_menu_structure():
    """
    GDP_API_0001 - 取得站台選單結構資料
    
    回傳雙層式選單（選單群組 > 頁面）的完整結構。
    
    **業務邏輯說明:**
    1. 查詢 gdp_menu_data 表取得所有選單群組，依 menu_no 欄位升冪排序
    2. 依每個選單的 menu_id 查詢 gdp_page_data 表取得該選單群組下的所有頁面，依 page_no 欄位升冪排序
    3. 組合選單群組與頁面資料，回傳完整的雙層結構
    4. 若查詢結果為空，回傳空陣列
    
    **排序邏輯:**
    - 選單群組按 menu_no 數字由小到大排序
    - 每個選單群組內的頁面按 page_no 數字由小到大排序
    
    **頁面顯示模式判斷:**
    - 若 dashboard_id 欄位有值，該頁面為內嵌模式
    - 若 url 欄位有值（且 dashboard_id 為空），該頁面為 URL 導頁模式
    - 若兩者皆有值，優先使用 dashboard_id（內嵌模式）
    - 若兩者皆無值，仍回傳該頁面資料，由前端判斷該頁面不可點選
    """
    try:
        logger.info("開始查詢選單結構資料")
        
        # Databricks 連線設定 (從環境變數取得)
        server_hostname = os.getenv("DATABRICKS_HOST")
        http_path = os.getenv("WAREHOUSE_HTTP_PATH")
        access_token = os.getenv("WAREHOUSE_TOKEN")
        
        # 驗證環境變數
        if not all([server_hostname, http_path, access_token]):
            logger.error("缺少必要的環境變數設定")
            raise HTTPException(
                status_code=500,
                detail={
                    "error": "資料庫連線設定不完整",
                    "errorCode": "DB_CONFIG_MISSING"
                }
            )
        
        menu_groups = []
        
        with sql.connect(
            server_hostname=server_hostname,
            http_path=http_path,
            access_token=access_token
        ) as connection:
            with connection.cursor() as cursor:
                # 查詢選單群組資料
                menu_query = """
                    SELECT menu_id, menu_name, menu_no
                    FROM dev_temp.data_engineer.gdp_menu_data
                    ORDER BY menu_no ASC
                """
                logger.info(f"執行選單查詢: {menu_query}")
                cursor.execute(menu_query)
                menu_results = cursor.fetchall()
                
                logger.info(f"查詢到 {len(menu_results)} 個選單群組")
                
                # 處理每個選單群組
                for menu_row in menu_results:
                    menu_id, menu_name, menu_no = menu_row
                    
                    # 查詢該選單下的頁面資料
                    page_query = """
                        SELECT page_id, page_name, page_no, dashboard_id, url
                        FROM dev_temp.data_engineer.gdp_page_data
                        WHERE menu_id = ?
                        ORDER BY page_no ASC
                    """
                    logger.info(f"執行頁面查詢 (menu_id={menu_id}): {page_query}")
                    cursor.execute(page_query, (menu_id,))
                    page_results = cursor.fetchall()
                    
                    logger.info(f"選單 {menu_id} 包含 {len(page_results)} 個頁面")
                    
                    # 組裝頁面資料
                    pages = []
                    for page_row in page_results:
                        page_id, page_name, page_no, dashboard_id, url = page_row
                        
                        # 建立頁面物件
                        page = Page(
                            pageId=page_id,
                            pageName=page_name,
                            pageNo=page_no,
                            iframeId=dashboard_id if dashboard_id else None,
                            pageUrl=url if url else None
                        )
                        pages.append(page)
                    
                    # 組裝選單群組資料
                    menu_group = MenuGroup(
                        menuId=menu_id,
                        menuName=menu_name,
                        menuNo=menu_no,
                        pages=pages
                    )
                    menu_groups.append(menu_group)
        
        logger.info(f"成功組裝 {len(menu_groups)} 個選單群組的完整結構")
        
        # 回傳選單結構
        return MenuStructureResponse(menuGroups=menu_groups)
        
    except HTTPException as he:
        # 重新拋出 HTTP 例外
        raise he
        
    except Exception as e:
        logger.error(f"查詢選單結構時發生錯誤: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": "資料庫查詢失敗",
                "errorCode": "DB_QUERY_ERROR"
            }
        )
