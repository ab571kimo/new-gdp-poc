# GDP POC 系統 - 後端 API

## 已實現的 API

### 1. GDP_API_0001 - 取得站台選單結構
- **路徑**: `GET /api/menu/structure`
- **功能**: 回傳雙層式選單（選單群組 > 頁面）的完整結構
- **資料來源**: 
  - `dev_temp.data_engineer.gdp_menu_data`
  - `dev_temp.data_engineer.gdp_page_data`

### 2. GDP_API_0002 - 批次更新選單與頁面結構
- **路徑**: `POST /api/menu/structure/batch-update`
- **功能**: 批次更新所有選單和頁面的資訊及排序
- **資料來源**: 
  - `dev_temp.data_engineer.gdp_menu_data`
  - `dev_temp.data_engineer.gdp_page_data`
- **交易處理**: 使用 Transaction 確保資料一致性

## 目錄結構

```
backend/
├── __init__.py
├── main.py                # FastAPI 主程式入口
├── static/                # 前端靜態檔案目錄
└── api/
    ├── __init__.py
    └── menu/
        ├── __init__.py
        └── menu.py        # 選單 API 實現
```

## 技術規格

- **框架**: FastAPI 0.109.0
- **Server**: Uvicorn 0.27.0
- **Python**: 3.11
- **資料庫**: Databricks SQL Warehouse

## 啟動方式

```bash
# 1. 安裝依賴套件
pip install -r requirements.txt

# 2. 啟動後端服務
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## API 文件

啟動服務後可訪問：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 資料庫連線

使用 Databricks SQL Warehouse 連線，透過以下方式取得認證資訊：
- `DATABRICKS_HOST`: 從環境變數取得
- `WAREHOUSE_HTTP_PATH`: 從 Databricks secrets (scope: gdp-poc-keys) 取得
- `WAREHOUSE_TOKEN`: 從 Databricks secrets (scope: gdp-poc-keys) 取得
