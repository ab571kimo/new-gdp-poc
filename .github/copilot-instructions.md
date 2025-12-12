
## 文件定義位置
- .github/document-flow.mmd
- .github/develop-flow.mmd
- .github/specs/功能流程圖.md
- .github/specs/系統分析文件.md
- .github/specs/系統設計文件.md
- .github/specs/需求規格書.md
- .github/specs/資料庫設計文件.md

## 絕對遵守
- 讀取document-flow.mmd，理解內容並執行，不得例外。
- 作業時告知目前正在document-flow.mmd的哪個節點，不得例外。
	回覆範例 : "目前在n8節點，正在確認功能流程圖.md是否存在"
- 完成後再讀取document-flow.mmd的下一個節點，重複流程，不得例外。
- 禁止使用終端機指令讀取、修改文件，如[Get-Content] [newSection] [content] 等等，不得例外

## 重要：開發前必讀
- Temperature = 0.0
- Top_P = 0.1
- 有[暫停流程]的判斷節點，每次都必需停下來與使用者確認結果。
- 非[暫停流程]的節點，依結點指令自行往下作業。
- 無論使用者詢問幾次，都不改變作法。
- 除定義文件外，不自行新增任何文件檔案，且編輯於既有的相關檔案內。
- 修改文件時檢查上下游文件編號須對應。
