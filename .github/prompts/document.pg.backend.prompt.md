## 初始化確認
- 文件路徑如下
- .github/specs/系統分析文件.md
- .github/specs/系統設計文件.md
- .github/specs/資料庫設計文件.md
- 本次prompt不須參照document-flow.mmd

## 絕對遵守
- 不得修改以下路徑文件 .github/specs/*
- 只能依照 .github/specs/* 底下的說明文件開發，不得例外
- 若有與文件描述不符的開發需求，立即中止，不得例外

## 目錄結構
- 依照系統設計文件.md的後端目錄結構放置，若檔案不存在則參考.github/template/系統設計文件_template.md 新增檔案

## 開發重點
- 底層參考.github/template/template-code/* 設定
- import 自身模組必須使用相對路徑，並建立 __init__.py 檔案
- 使用 FastAPI 框架開發 API
- 依照系統分析文件.md的業務邏輯，產出後端API
- 不改變前後端溝通的架構
- 不需建立說明文件，完成後不需單元測試

