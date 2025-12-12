# 系統分析文件 [專案名稱]

版本：001 <!--  每次更新 -->

## 1. 更新紀錄

<!-- 範例
| 日期    | API編號 | 說明      | 
| ------- | ------- | ---------|
| ...     | ...     | ...      |
| ...     | ...     | ...      |

最小顆粒度為需求規格書[序號]

說明欄位內容
格式 : 依據需求規格書[序號]進行修改，......

 -->

## 2. API 設計

### 2.1 API 列表

<!-- 範例
- GDP_API_0001 - GET /api/revenue/trend?range=12m
- GDP_API_0002 - GET /api/news/latest?limit=5
- 以下續編
-->

### 2.2 API 參數說明

<!-- 範例
- GDP_API_0001 - GET /api/revenue/trend?range=12m

Request:

| 位置 | 參數 | 類型 | 必填 | 說明 |
|---|---:|---:|---:|--- |

Response 200:

| 欄位 | 類型 | 說明 |
|---|---:|--- |

資料來源表: revenue_monthly 

```sql
SELECT CONCAT(year, '-', LPAD(month,2,'0')) AS month,
       SUM(revenue_amount) AS revenue
FROM revenue_monthly
WHERE (year > :start_year) OR (year = :start_year AND month >= :start_month)
```

- GDP_API_0002 - GET /api/news/latest?limit=5

 以下續編 
 
 -->