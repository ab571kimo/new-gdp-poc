# GDP POC 系統

版本：001

## 專案說明

GDP POC 系統是一個基於 FastAPI (Python) 後端和 React (TypeScript) 前端的 Web 應用程式。
提供雙層式選單結構（選單群組 > 頁面），支援內嵌頁面與 URL 導頁兩種顯示模式。

## 技術架構

### 後端
- Python 3.11
- FastAPI 0.109.0
- Uvicorn 0.27.0
- Databricks SQL Connector

### 前端
- React 18.2
- TypeScript 5.x
- Vite 5.x

## 目錄結構

```
gdp-poc/
├── backend/                 # 後端程式碼
│   ├── __init__.py
│   ├── main.py             # FastAPI 主應用程式
│   └── api/
│       └── menu/
│           ├── __init__.py
│           └── menu.py     # 選單 API (GDP_API_0001)
├── frontend/               # 前端程式碼
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.node.json
│   └── src/
│       ├── main.tsx        # React 入口
│       ├── index.css       # 全局樣式
│       ├── components/     # 共用組件
│       │   ├── Header/     # Header 組件
│       │   └── Sidebar/    # Sidebar 組件
│       ├── GDP_UI_01/      # 系統首頁
│       └── GDP_UI_02/      # 內容顯示頁面
├── app.yaml               # Databricks Apps 配置
├── package.json           # Node.js 依賴
├── requirements.txt       # Python 依賴
└── tsconfig.json         # TypeScript 配置
```

## 環境變數設定

### Databricks 連線
在 `app.yaml` 或環境變數中設定：

```yaml
env:
  - name: DATABRICKS_HOST
    value: "your-databricks-host"
  - name: WAREHOUSE_HTTP_PATH
    value: "your-warehouse-http-path"
  - name: WAREHOUSE_TOKEN
    value: "your-access-token"
```

## 本機開發

### 1. 安裝依賴套件

```bash
# 安裝 Python 依賴
pip install -r requirements.txt

# 安裝 Node.js 依賴
npm install
```

### 2. 建置前端

```bash
npm run build
```

這會將前端打包到 `backend/static/` 目錄。

### 3. 啟動後端服務

```bash
# 方式一：使用 uvicorn
uvicorn backend.main:app --host 0.0.0.0 --port 8000

# 方式二：使用提供的腳本
bash ../run.sh
```

### 4. 開發模式

前端開發時可以使用 Vite 開發伺服器：

```bash
npm run dev
```

這會啟動前端開發伺服器並自動代理 API 請求到後端。

## API 文件

### GDP_API_0001 - 取得站台選單結構資料

**Endpoint:** `GET /api/menu/structure`

**Response 範例:**
```json
{
  "menuGroups": [
    {
      "menuId": "menu001",
      "menuName": "功能選單 A",
      "menuNo": 1,
      "pages": [
        {
          "pageId": "page001",
          "pageName": "內嵌頁面 A1",
          "pageNo": 1,
          "iframeId": "iframe_a1"
        },
        {
          "pageId": "page002",
          "pageName": "URL導頁 A2",
          "pageNo": 2,
          "pageUrl": "https://example.com/page-a2"
        }
      ]
    }
  ]
}
```

## 功能說明

### GDP_UI_01 - 系統首頁
- 包含 Header、Sidebar 和 Content Area 三個區域
- 自動載入選單結構（GDP_FC_001）
- 點選 Header 標題可回到首頁

### GDP_UI_02 - 內容顯示頁面
- 支援兩種顯示模式：
  - **內嵌模式**：有 `iframeId` 時，內容嵌入顯示區域
  - **URL 導頁模式**：有 `pageUrl` 時，執行頁面導向
- 若兩者皆有，優先使用內嵌模式
- 若兩者皆無，該選單項目不可點選

## Databricks Apps 部署

專案已配置 `app.yaml`，可直接部署到 Databricks Apps：

```yaml
command: ["uvicorn", "backend.main:app"]
```

## 開發規範

1. 所有 import 必須包含副檔名（`.tsx`, `.ts`, `.css`）
2. 使用相對路徑 import 自身模組
3. 前端參數必須使用系統分析文件定義的 API 格式
4. 深色底白字設計風格
5. API 路徑統一以 `/api/` 開頭

## 相關文件

- `.github/specs/需求規格書.md`
- `.github/specs/功能流程圖.md`
- `.github/specs/系統分析文件.md`
- `.github/specs/系統設計文件.md`
- `.github/specs/資料庫設計文件.md`
