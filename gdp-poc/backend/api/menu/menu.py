"""
Menu API - GDP POC 選單結構管理
提供選單與頁面的查詢和批次更新功能
"""

import os
import logging
import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field, field_validator
from databricks import sql

logger = logging.getLogger(__name__)
router = APIRouter()


# --- Pydantic Models ---
class PageData(BaseModel):
    """頁面資料模型"""
    page_id: str = Field(..., description="頁面識別碼")
    page_name: str = Field(..., min_length=1, max_length=50, description="頁面名稱")
    page_no: int = Field(..., gt=0, description="頁面排序編號")
    menu_id: str = Field(..., description="所屬選單識別碼")
    dashboard_id: Optional[str] = Field(None, description="內嵌頁面識別碼")
    url: Optional[str] = Field(None, description="頁面網址")
    genie_id: Optional[str] = Field(None, description="Genie識別碼")


class MenuGroup(BaseModel):
    """選單群組模型"""
    menu_id: str = Field(..., description="選單識別碼")
    menu_name: str = Field(..., min_length=1, max_length=50, description="選單名稱")
    menu_no: int = Field(..., gt=0, description="選單排序編號")
    pages: List[PageData] = Field(default_factory=list, description="頁面列表")


class BatchUpdateRequest(BaseModel):
    """批次更新請求模型"""
    menuGroups: List[MenuGroup] = Field(..., description="完整的選單群組列表")


class MenuStructureResponse(BaseModel):
    """選單結構回應模型"""
    menuGroups: List[MenuGroup]


class SuccessResponse(BaseModel):
    """成功回應模型"""
    success: bool
    message: str


class ErrorResponse(BaseModel):
    """錯誤回應模型"""
    success: bool = False
    message: str
    error: str


# --- Database Connection Helper ---
def get_databricks_connection():
    """建立 Databricks SQL 連線"""
    try:
        server_hostname = os.getenv("DATABRICKS_HOST")
        
        from databricks.sdk.runtime import dbutils
        http_path = dbutils.secrets.get(scope="gdp-poc-keys", key="WAREHOUSE_HTTP_PATH")
        access_token = dbutils.secrets.get(scope="gdp-poc-keys", key="WAREHOUSE_TOKEN")
        
        connection = sql.connect(
            server_hostname=server_hostname,
            http_path=http_path,
            access_token=access_token
        )
        return connection
    except Exception as e:
        logger.error(f"❌ Databricks 連線失敗: {e}")
        raise HTTPException(status_code=500, detail="資料庫連線失敗")


# --- API Endpoints ---

@router.get("/structure", response_model=MenuStructureResponse, status_code=200)
async def get_menu_structure(request: Request):
    """
    GDP_API_0001 - 取得站台選單結構資料
    
    回傳雙層式選單（選單群組 > 頁面）的完整結構，依據使用者權限過濾
    
    Args:
        request: FastAPI Request 物件，用於取得 headers
    
    Returns:
        MenuStructureResponse: 包含選單群組和頁面的完整結構（已過濾權限）
    """
    start_time = time.time()
    logger.info("📋 GET /api/menu/structure: 開始查詢選單結構")
    
    # 從 Request Header 取得使用者 ID
    user_id = request.headers.get("X-Forwarded-Email")
    if not user_id:
        logger.warning("⚠️ 缺少 X-Forwarded-Email header")
        raise HTTPException(
            status_code=400,
            detail={"error": "缺少使用者識別資訊", "errorCode": "MISSING_USER_ID"}
        )
    
    logger.info(f"👤 使用者: {user_id}")
    
    try:
        connection = get_databricks_connection()
        
        with connection:
            cursor = connection.cursor()
            
            # 1. 查詢使用者有授權的頁面 ID 列表
            user_page_query = """
                SELECT page_id
                FROM dev_temp.data_engineer.gdp_user_page
                WHERE user_id = ?
            """
            logger.info(f"🔍 查詢使用者 {user_id} 的授權頁面...")
            cursor.execute(user_page_query, (user_id,))
            authorized_page_rows = cursor.fetchall()
            authorized_page_ids = {row[0] for row in authorized_page_rows}
            logger.info(f"✓ 使用者擁有 {len(authorized_page_ids)} 個授權頁面")
            
            # 2. 查詢所有選單群組，依 menu_no 升冪排序
            menu_query = """
                SELECT menu_id, menu_name, menu_no
                FROM dev_temp.data_engineer.gdp_menu_data
                ORDER BY menu_no ASC
            """
            logger.info("🔍 執行選單查詢...")
            cursor.execute(menu_query)
            menu_rows = cursor.fetchall()
            
            menu_groups = []
            
            # 3. 為每個選單群組查詢對應的頁面（含權限過濾）
            for menu_row in menu_rows:
                menu_id, menu_name, menu_no = menu_row
                
                page_query = """
                    SELECT p.page_id, p.page_name, p.page_no, p.menu_id, p.dashboard_id, p.url, p.genie_id
                    FROM dev_temp.data_engineer.gdp_page_data p
                    INNER JOIN dev_temp.data_engineer.gdp_user_page up ON p.page_id = up.page_id
                    WHERE p.menu_id = ?
                      AND up.user_id = ?
                    ORDER BY p.page_no ASC
                """
                cursor.execute(page_query, (menu_id, user_id))
                page_rows = cursor.fetchall()
                
                pages = []
                for page_row in page_rows:
                    page_id, page_name, page_no, p_menu_id, dashboard_id, url, genie_id = page_row
                    pages.append(PageData(
                        page_id=page_id,
                        page_name=page_name,
                        page_no=page_no,
                        menu_id=p_menu_id,
                        dashboard_id=dashboard_id,
                        url=url,
                        genie_id=genie_id
                    ))
                
                # 4. 過濾選單群組：只保留有頁面的選單
                if pages:
                    menu_groups.append(MenuGroup(
                        menu_id=menu_id,
                        menu_name=menu_name,
                        menu_no=menu_no,
                        pages=pages
                    ))
                else:
                    logger.info(f"⊘ 選單 {menu_id} - {menu_name} 無授權頁面，已過濾")
            
            cursor.close()
        
        query_time = time.time() - start_time
        logger.info(f"✅ 查詢成功，共 {len(menu_groups)} 個選單群組 (耗時: {query_time:.2f}秒)")
        
        return MenuStructureResponse(menuGroups=menu_groups)
    
    except HTTPException:
        raise
    except Exception as e:
        query_time = time.time() - start_time
        logger.error(f"❌ 查詢失敗 (耗時: {query_time:.2f}秒): {e}")
        raise HTTPException(
            status_code=500,
            detail={"error": str(e), "errorCode": "QUERY_ERROR"}
        )


@router.post("/structure/batch-update", response_model=SuccessResponse, status_code=200)
async def batch_update_menu_structure(request: BatchUpdateRequest):
    """
    GDP_API_0002 - 批次更新選單與頁面結構
    
    一次性更新所有選單和頁面的資訊及排序，使用 Transaction 確保資料一致性
    
    Args:
        request: 包含完整選單群組列表的批次更新請求
    
    Returns:
        SuccessResponse: 更新成功的回應訊息
    """
    start_time = time.time()
    logger.info("📝 POST /api/menu/structure/batch-update: 開始批次更新")
    logger.info(f"📊 更新資料: {len(request.menuGroups)} 個選單群組")
    
    try:
        connection = get_databricks_connection()
        
        with connection:
            cursor = connection.cursor()
            
            # 開啟交易
            logger.info("🔄 開始交易...")
            
            try:
                # 更新選單資料
                for menu_group in request.menuGroups:
                    menu_merge_query = """
                        MERGE INTO dev_temp.data_engineer.gdp_menu_data AS target
                        USING (SELECT ? AS menu_id, ? AS menu_name, ? AS menu_no) AS source
                        ON target.menu_id = source.menu_id
                        WHEN MATCHED THEN
                            UPDATE SET 
                                menu_name = source.menu_name,
                                menu_no = source.menu_no
                        WHEN NOT MATCHED THEN
                            INSERT (menu_id, menu_name, menu_no)
                            VALUES (source.menu_id, source.menu_name, source.menu_no)
                    """
                    cursor.execute(menu_merge_query, (
                        menu_group.menu_id,
                        menu_group.menu_name,
                        menu_group.menu_no
                    ))
                    logger.info(f"✓ 更新選單: {menu_group.menu_id} - {menu_group.menu_name}")
                    
                    # 更新該選單下的頁面資料
                    for page in menu_group.pages:
                        page_merge_query = """
                            MERGE INTO dev_temp.data_engineer.gdp_page_data AS target
                            USING (
                                SELECT 
                                    ? AS page_id,
                                    ? AS page_name,
                                    ? AS page_no,
                                    ? AS menu_id,
                                    ? AS dashboard_id,
                                    ? AS url,
                                    ? AS genie_id
                            ) AS source
                            ON target.page_id = source.page_id
                            WHEN MATCHED THEN
                                UPDATE SET 
                                    page_name = source.page_name,
                                    page_no = source.page_no,
                                    menu_id = source.menu_id,
                                    dashboard_id = source.dashboard_id,
                                    url = source.url,
                                    genie_id = source.genie_id
                            WHEN NOT MATCHED THEN
                                INSERT (page_id, page_name, page_no, menu_id, dashboard_id, url, genie_id)
                                VALUES (source.page_id, source.page_name, source.page_no, source.menu_id, 
                                        source.dashboard_id, source.url, source.genie_id)
                        """
                        cursor.execute(page_merge_query, (
                            page.page_id,
                            page.page_name,
                            page.page_no,
                            page.menu_id,
                            page.dashboard_id,
                            page.url,
                            page.genie_id
                        ))
                        logger.info(f"  ✓ 更新頁面: {page.page_id} - {page.page_name}")
                
                # 提交交易
                connection.commit()
                logger.info("✅ 交易提交成功")
                
            except Exception as e:
                # 回滾交易
                connection.rollback()
                logger.error(f"❌ 交易回滾: {e}")
                raise HTTPException(
                    status_code=500,
                    detail={
                        "success": False,
                        "message": "系統錯誤",
                        "error": f"資料庫更新失敗，交易已回滾: {str(e)}"
                    }
                )
            finally:
                cursor.close()
        
        update_time = time.time() - start_time
        logger.info(f"✅ 批次更新完成 (耗時: {update_time:.2f}秒)")
        
        return SuccessResponse(
            success=True,
            message="選單與頁面結構批次更新成功"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        update_time = time.time() - start_time
        logger.error(f"❌ 批次更新失敗 (耗時: {update_time:.2f}秒): {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "系統錯誤",
                "error": str(e)
            }
        )
