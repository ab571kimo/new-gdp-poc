## 初始化確認
- 開發前讀取以下文件
- .github/specs/需求規格書.md
- .github/specs/功能流程圖.md
- .github/specs/系統分析文件.md
- .github/specs/系統設計文件.md
- 本次prompt不須參照document-flow.mmd

## 絕對遵守
- 不得修改以下路徑文件 .github/specs/*
- 只能依照 .github/specs/* 底下的說明文件開發，不得例外
- 若有與文件描述不符的開發需求，立即中止，不得例外

## 目錄結構
- 依照系統設計文件.md的前端目錄結構放置，若檔案不存在則參考.github/template/系統設計文件_template.md 新增檔案
- 每個UI畫面都要有對應的css,tsx檔案，ts依情況可沒有

## 開發重點
- 根據需求規格書.md的頁面編號，依路徑 .github/specs/wireframe/{頁面編號}.html 找到對應畫面設計開發
- 架構參考.github/template/template-code/* 設定
- 用React框架開發。
- 前端參數必須使用系統分析文件.md的API定義
- 不需建立說明文件，完成後不需測試
- 如果發現沒有對應的API，請終止工作並回應
- 所有的import檔案路徑都必須加副檔名
