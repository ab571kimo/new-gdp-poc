# GDP POC 系統 - 前端開發完成

## 已實現的頁面

### 1. GDP_UI_01 - 系統首頁
- **路徑**: `/`
- **功能**: 顯示歡迎標語，作為系統初始頁面
- **包含功能**: GDP_FC_001 - 讀取選單結構（透過 Sidebar 組件）

### 2. GDP_UI_02 - 內容顯示頁面
- **路徑**: `/page/:pageId`
- **功能**: 根據選單項目點擊，顯示對應頁面內容
- **支援模式**:
  - 內嵌模式：有 `dashboard_id` 時使用
  - URL 導頁模式：有 `url` 時使用
  - 優先順序：`dashboard_id` > `url`

### 3. GDP_UI_03 - 選單管理頁面
- **路徑**: `/admin/menu-management`
- **功能**: 管理系統選單與頁面結構
- **包含功能**:
  - GDP_FC_002 - 讀取選單管理資料
  - GDP_FC_003 - 管理與確定選單結構變更

## 共用組件

### Header 組件
- 顯示系統標題「GDP POC 系統」
- 點擊標題可返回首頁
- 深色底白字設計

### Sidebar 組件
- 左側選單區域
- 雙層式選單結構（選單群組 > 頁面）
- 自動從 API 讀取選單資料
- 支援選單展開/收合
- 無法點擊沒有 `dashboard_id` 或 `url` 的頁面項目

## 目錄結構

```
frontend/
├── index.html
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── index.css
    ├── App.tsx
    ├── App.css
    ├── components/
    │   ├── Layout/
    │   │   └── Layout.tsx
    │   └── Sidebar/
    │       ├── Sidebar.tsx
    │       └── Sidebar.css
    ├── GDP_UI_01/
    │   ├── GDP_UI_01.tsx
    │   └── GDP_UI_01.css
    ├── GDP_UI_02/
    │   ├── GDP_UI_02.tsx
    │   └── GDP_UI_02.css
    └── GDP_UI_03/
        ├── GDP_UI_03.tsx
        ├── GDP_UI_03.ts
        └── GDP_UI_03.css
```

## API 整合

所有前端頁面都正確使用系統分析文件定義的 API：

### GDP_API_0001 - GET /api/menu/structure
- 使用位置：Sidebar.tsx, GDP_UI_02.tsx, GDP_UI_03.tsx
- 參數格式：snake_case（與資料庫欄位一致）
- Response 欄位：`menuGroups`, `menu_id`, `menu_name`, `menu_no`, `pages`, `page_id`, `page_name`, `page_no`, `dashboard_id`, `url`, `genie_id`

### GDP_API_0002 - POST /api/menu/structure/batch-update
- 使用位置：GDP_UI_03.tsx
- Request Body：完整的選單結構資料
- 包含完整的資料驗證邏輯

## 資料驗證

GDP_UI_03 實現了完整的前端資料驗證：

- **選單名稱**: 1-50 字元，不可為空白
- **頁面名稱**: 1-50 字元，不可為空白
- **DASHBOARDID**: 0-200 字元，可為空白
- **URL**: 0-200 字元，可為空白
- **GENIEID**: 0-200 字元，可為空白

## 技術特點

✅ 使用 **React 18.2** + **TypeScript 5.x**  
✅ 使用 **React Router** 進行路由管理  
✅ 所有 import 路徑都加上 **.tsx / .ts / .css 副檔名**  
✅ 深色底白字介面設計  
✅ 完整的錯誤處理和異常狀態顯示  
✅ 符合需求規格書的所有 UI 互動要求  
✅ 與後端 API 參數完全對應

## 安裝與執行

```bash
# 1. 安裝前端套件
npm install

# 2. 開發模式
npm run dev

# 3. 建置生產版本
npm run build
```

建置後的檔案會輸出到 `backend/static/` 目錄，供 FastAPI 提供靜態檔案服務。

## 特殊處理

1. **選單載入失敗**: 左側選單區域保持空白，不顯示錯誤訊息
2. **選單無資料**: 左側選單區域保持空白
3. **頁面不可點選**: 沒有 `dashboard_id` 和 `url` 的頁面項目不可點選
4. **URL 導頁**: 有 `url` 且無 `dashboard_id` 時自動執行頁面跳轉
5. **即時驗證**: 編輯時進行即時驗證，但不呼叫後端 API
6. **批次確定**: 點選「確定全部變更」後統一送出所有變更

## 依循規範

✅ 不修改 `.github/specs/*` 下的文件  
✅ 依照系統設計文件的目錄結構放置  
✅ 參考 template-code 的架構設定  
✅ 使用系統分析文件定義的 API 參數  
✅ 實現需求規格書定義的所有功能  
✅ 依照 wireframe 設計頁面 UI  
✅ 所有 import 路徑都加副檔名  

前端開發已完成，可與後端 API 進行整合測試。
