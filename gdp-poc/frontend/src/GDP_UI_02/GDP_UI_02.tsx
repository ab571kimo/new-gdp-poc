/**
 * GDP_UI_02 - 內容顯示頁面
 * 根據選單點擊顯示對應的頁面內容（內嵌模式或 URL 導頁）
 */

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './GDP_UI_02.css'

interface PageData {
  page_id: string
  page_name: string
  page_no: number
  menu_id: string
  dashboard_id: string | null
  url: string | null
  genie_id: string | null
}

interface MenuGroup {
  menu_id: string
  menu_name: string
  menu_no: number
  pages: PageData[]
}

interface MenuStructureResponse {
  menuGroups: MenuGroup[]
}

const GDP_UI_02: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>()
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPageData()
  }, [pageId])

  const fetchPageData = async () => {
    try {
      const response = await fetch('/api/menu/structure')
      if (!response.ok) {
        console.error('Failed to fetch menu data')
        return
      }
      const result: MenuStructureResponse = await response.json()
      
      // 從所有選單群組中找到對應的頁面
      let foundPage: PageData | null = null
      for (const group of result.menuGroups) {
        const page = group.pages.find(p => p.page_id === pageId)
        if (page) {
          foundPage = page
          break
        }
      }
      
      if (foundPage) {
        setPageData(foundPage)
        
        // 如果有 url 且沒有 dashboard_id，進行 URL 導頁
        if (foundPage.url && !foundPage.dashboard_id) {
          window.location.href = foundPage.url
        }
      }
    } catch (err) {
      console.error('Error fetching page data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-message">載入中...</div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="page-container">
        <div className="error-message">頁面不存在</div>
      </div>
    )
  }

  // 內嵌模式
  if (pageData.dashboard_id) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="embedded-content">
            <h3>嵌入式內容區塊</h3>
            <p>頁面名稱: {pageData.page_name}</p>
            <p>Dashboard ID: {pageData.dashboard_id}</p>
            {pageData.genie_id && <p>Genie ID: {pageData.genie_id}</p>}
            <div className="content-info">
              <p>這裡可以放置實際的功能頁面內容，例如：</p>
              <ul>
                <li>表單輸入介面</li>
                <li>資料查詢結果</li>
                <li>圖表與統計資料</li>
                <li>各種業務功能元件</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // URL 導頁模式（如果執行到這裡，表示沒有觸發導頁）
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="url-redirect-notice">
          <p><strong>⚠ 導頁提示</strong></p>
          <p>頁面名稱: {pageData.page_name}</p>
          <p>目標 URL: {pageData.url || '未設定'}</p>
        </div>
      </div>
    </div>
  )
}

export default GDP_UI_02
