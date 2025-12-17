/**
 * Page2 Component
 * 頁面2
 */

import React from 'react'
import { useLocation } from 'react-router-dom'
import './Page2.css'

const Page2: React.FC = () => {
  const location = useLocation()

  return (
    <div className="page2">
      <div className="page2-header">
        <h1>📄 頁面2</h1>
        <p>這是頁面2的內容</p>
      </div>

      <div className="page2-content">
        <h2>頁面說明</h2>
        <p>
          這是一個獨立的頁面，從選單的「頁面2」選項進入。
        </p>
        <p>
          您可以在這裡開發頁面2的具體功能。
        </p>
      </div>

      <div className="page2-info">
        <h3>✨ 功能特點</h3>
        <ul>
          <li>獨立的頁面組件</li>
          <li>完整的路由支援</li>
          <li>可自訂內容與功能</li>
          <li>響應式設計</li>
        </ul>
      </div>

      <div className="route-info">
        <div className="route-info-label">目前路由位置：</div>
        <div className="route-info-value">{location.pathname}</div>
      </div>
    </div>
  )
}

export default Page2
