"""
Menu API - 虛擬選單資料
提供選單列表，點選後導向temp頁面
"""

from fastapi import APIRouter
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/list")
async def get_menu_list():
    """
    取得虛擬選單列表
    
    Returns:
        dict: 包含 success 和 data 的回應
            - success (bool): 查詢是否成功
            - data (list): 選單資料陣列
                - menuId (str): 選單ID
                - menuName (str): 選單名稱
                - children (list): 子選單陣列
                    - menuId (str): 子選單ID
                    - menuName (str): 子選單名稱
                    - route (str): 路由路徑
    """
    logger.info("📋 /api/menu/list: 取得虛擬選單列表")
    
    # 虛擬假資料
    mock_data = [
        {
            "menuId": "m-group-01",
            "menuName": "站台功能",
            "children": [
                {
                    "menuId": "m-item-01",
                    "menuName": "chatbot 聊天機器人",
                    "route": "/chatbot"
                },
                {
                    "menuId": "m-item-02",
                    "menuName": "儀錶板",
                    "route": "/dashboard"
                }
            ]
        },
        {
            "menuId": "m-group-02",
            "menuName": "系統設定",
            "children": [
                {
                    "menuId": "m-item-04",
                    "menuName": "系統設定頁面",
                    "route": "/system-config"
                }
            ]
        }
    ]
    
    response = {
        "success": True,
        "data": mock_data
    }
    
    logger.info(f"✅ 成功回傳 {len(mock_data)} 個選單群組")
    
    return response
