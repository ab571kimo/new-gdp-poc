# 系統設計文件 [專案名稱]
- 用於Databricks apps 
- 沒提到的技術不自己想像 

# 開發規範 

本系統為一個 React (TypeScript) 前端 + FastAPI 後端的專案。
- 目標部署環境包含：本機開發與 Databricks Apps（使用 `app.yaml` 進行執行命令宣告）。

<!-- 範例
- 依照一般大眾認知的開發規範續編
-->

# 使用技術 

**Language/Runtime**:
- Backend: Python 3.11
- Frontend: TypeScript 5.x + React 18.2

**Primary Dependencies**:
- Backend: FastAPI 0.109.0, Uvicorn 0.27.0, python-multipart 0.0.9, aiofiles 23.2.1
- Frontend: React, React-DOM, Vite 5.x, @vitejs/plugin-react, Chart.js 4.4.0, react-chartjs-2 5.2.0
<!--- 以下續編 -->


# 使用套件、版本 


##backend
-backend套件需同步更新至/requirements.txt

| 套件 | 版本 | 用途 |
|------|------|------|
| fastapi | 0.109.0 | API 框架 |
| uvicorn | 0.27.0 | ASGI Server |
| python-multipart | 0.0.9 | 處理表單/檔案上傳（未來擴充） |
| aiofiles | 23.2.1 | 非同步檔案存取 |
<!--- 以下續編 -->

##frontend

| 套件 | 版本 | 用途 |
|------|------|------|
| react | ^18.2.0 | UI Library |
| react-dom | ^18.2.0 | DOM Render |
| chart.js | ^4.4.0 | 圖表繪製核心 |
| react-chartjs-2 | ^5.2.0 | Chart.js React 包裝 |
| vite | ^5.0.0 | 打包/開發伺服器 |
| @vitejs/plugin-react | ^4.2.0 | React 插件 |
| typescript | ^5.0.0 | 型別系統 |
<!--- 以下續編 -->

# 程式架構，[必須]讀取資料夾下所有檔案，並且依照作業
- .github\template\template-code\*

## 以下檔案[必須]依照template-code位置存放，且內容不變
- vite.config.ts
- tsconfig.json
- package.json
- app.yaml
## 以下檔案不存在，不需建立
- tsconfig.node.json

## 執行專案
```
# 1. 安裝套件
npm install
pip install -r requirements.txt

# 2. 建置前端
npm run build

# 3. 啟動後端
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

# 路由處理邏輯
- [必須]依照template-code方式作業


# 目錄結構 

存放路徑於 ./{project_name}/

## backend
```
backend/
├── __init__.py
├── main.py
└── api/
    ├── {api_name1}/      
	└── {api_name2}/
		├── __init__.py
		└── api_name2.py	
```	

## frontend
```
frontend/
├── index.html             (Vite 入口)
└── src/
    ├── components\   (站台共用的css,tsx,ts放這)
    |   ├── Header\
    |   └── Sidebar\  
    ├── {ui編號1}\         
    └── {ui編號2}\   (頁面專用的css,tsx,ts放這)
        ├── {ui_name2}.css 
        ├── {ui_name2}.tsx (放 UI 元件、JSX、渲染邏輯)
        └── {ui_name2}.ts  (放邏輯、函式、API 呼叫、型別定義)   
```



# Databricks 資料庫連線方式

```

程式碼
    try:
        # Databricks 連線設定 (從環境變數取得)
        server_hostname = os.getenv("DATABRICKS_HOST")
        http_path = os.getenv("WAREHOUSE_HTTP_PATH")
        access_token = os.getenv("WAREHOUSE_TOKEN")
        
        with sql.connect(
            server_hostname=server_hostname,
            http_path=http_path,
            access_token=access_token
        ) as connection:
            with connection.cursor() as cursor:
                cursor.execute("SQL CODE")
                raw_results = cursor.fetchall()
                users = {row[0] for row in raw_results if row[0] and row[0].strip()}
                return users
                
    except Exception as e:
        query_time = time.time() - start_time
        logger.error(f"❌ 資料庫連線失敗 (耗時: {query_time:.2f}秒): {e}")
        return {}
```

# Databricks 取得scope方式
```
dbutils.secrets.get(scope="你的scope名稱", key="你的key名稱")
```