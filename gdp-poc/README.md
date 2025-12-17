# GDP POC 系統

一個基於 FastAPI 和 React 的選單管理系統，支援雙層式選單結構與動態頁面顯示。

## 系統架構

- **後端**: FastAPI (Python 3.11)
- **前端**: React 18.2 + TypeScript 5.x
- **資料庫**: Databricks SQL Warehouse
- **部署**: Databricks Apps

## 專案結構

```
gdp-poc/
├── backend/                    # 後端 API
│   ├── __init__.py
│   ├── main.py                # FastAPI 主程式
│   ├── static/                # 前端建置輸出目錄
│   ├── api/
│   │   └── menu/
│   │       ├── __init__.py
│   │       └── menu.py        # 選單 API
│   └── README.md
├── frontend/                   # 前端應用
│   ├── index.html
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/       # 共用組件
│   │   │   ├── Layout/
│   │   │   └── Sidebar/
│   │   ├── GDP_UI_01/        # 系統首頁
│   │   ├── GDP_UI_02/        # 內容顯示頁面
│   │   └── GDP_UI_03/        # 選單管理頁面
│   └── README.md
├── .databricks/
│   └── .gitignore
├── app.yaml                   # Databricks Apps 配置
├── package.json               # Node.js 配置
├── requirements.txt           # Python 依賴
└── tsconfig.json             # TypeScript 配置
```

## 功能列表

### 已實現的 API

1. **GDP_API_0001** - `GET /api/menu/structure`
   - 取得站台選單結構資料
   - 回傳雙層式選單（選單群組 > 頁面）

2. **GDP_API_0002** - `POST /api/menu/structure/batch-update`
   - 批次更新選單與頁面結構
   - 使用 Transaction 確保資料一致性

### 已實現的頁面

1. **GDP_UI_01** - 系統首頁 (`/`)
   - 顯示歡迎標語
   - 包含 Header 和 Sidebar

2. **GDP_UI_02** - 內容顯示頁面 (`/page/:pageId`)
   - 支援內嵌模式（dashboard_id）
   - 支援 URL 導頁模式（url）

3. **GDP_UI_03** - 選單管理頁面 (`/admin/menu-management`)
   - 編輯選單名稱
   - 編輯頁面資訊（名稱、DASHBOARDID、URL、GENIEID）
   - 調整選單與頁面順序
   - 批次確定變更

## 安裝與執行

### 1. 安裝套件

```bash
# 安裝 Node.js 套件
npm install

# 安裝 Python 套件
pip install -r requirements.txt
```

### 2. 開發模式

```bash
# 前端開發伺服器（含 API 代理）
npm run dev

# 後端開發伺服器（另開終端）
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. 生產環境

```bash
# 建置前端
npm run build

# 啟動後端（會自動提供前端靜態檔案）
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## 資料庫設定

系統使用 Databricks SQL Warehouse，需要設定以下環境變數和 secrets：

- **環境變數**: `DATABRICKS_HOST`
- **Databricks Secrets** (scope: `gdp-poc-keys`):
  - `WAREHOUSE_HTTP_PATH`
  - `WAREHOUSE_TOKEN`

## 資料表

- `dev_temp.data_engineer.gdp_menu_data` - 選單資料表
- `dev_temp.data_engineer.gdp_page_data` - 頁面資料表

## 技術規格

### Backend
- FastAPI 0.109.0
- Uvicorn 0.27.0
- Databricks SQL Connector
- Python 3.11

### Frontend
- React 18.2
- TypeScript 5.x
- Vite 5.x
- React Router DOM 6.20

## API 文件

啟動後端服務後，可訪問自動生成的 API 文件：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 介面設計

- 深色底白字設計
- 雙層式選單結構
- 響應式布局
- 即時驗證與錯誤提示

## 開發規範

本專案嚴格遵循以下文件規範：

- 需求規格書
- 系統分析文件
- 系統設計文件
- 資料庫設計文件
- 功能流程圖

所有實現都基於這些文件，未進行額外的功能擴充。
