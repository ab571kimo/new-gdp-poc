## 初始化確認
- 開發前讀取以下文件
- .github/specs/需求規格書.md
- .github/specs/功能流程圖.md
- .github/specs/系統分析文件.md
- .github/specs/系統設計文件.md
- 本次prompt不須參照document-flow.mmd

# 前端架構，[必須]讀取資料夾下所有檔案，並且依照架構作業
- .github\template\template-code\*

## 以下檔案[必須]依照template-code位置存放，且內容不變
- vite.config.ts
- tsconfig.json
## 以下檔案不存在，不需建立
- tsconfig.node.json

## 絕對遵守
- 不得修改以下路徑文件 .github/specs/*
- 只能依照 .github/specs/* 底下的說明文件開發，不得例外
- 若有與文件描述不符的開發需求，立即中止，不得例外

## 目錄結構
- 依照系統設計文件.md的前端目錄結構放置，若檔案不存在則參考.github/template/系統設計文件_template.md 新增檔案
- 每個UI畫面都要有對應的css,tsx檔案，ts依情況可沒有

## 開發重點
- 根據需求規格書.md的頁面編號，依路徑 .github/specs/wireframe/{頁面編號}.html 找到對應畫面設計開發
- 前端參數必須使用系統分析文件.md的API定義
- 如果有 url ，內部連結讓 React Router 處理
- 不需建立說明文件，完成後不需測試
- 如果發現沒有對應的API，請終止工作並回應
- 所有的import檔案路徑都必須加副檔名
