/**
 * Page4 Component
 * 頁面4
 */

import React from 'react'
import { useLocation } from 'react-router-dom'
import './Page4.css'

const Page4: React.FC = () => {
  const location = useLocation()

  return (
    <div className="page4">
      <div className="page4-header">
        <h1>🎯 頁面4</h1>
        <p>這是頁面4的內容</p>
      </div>

      <div className="page4-content">
        <h2>頁面說明</h2>
        <p>
          這是一個獨立的頁面，從選單的「功能項目 1」進入。
        </p>
        <p>
          您可以在這裡開發頁面4的具體功能與內容。
        </p>
      </div>

      <div className="page4-info">
        <h3>✨ 功能特點</h3>
        <ul>
          <li>模組化的頁面組件</li>
          <li>獨立的樣式設計</li>
          <li>完整的路由支援</li>
          <li>可擴展的功能架構</li>
        </ul>
      </div>

      <div className="route-info">
        <div className="route-info-label">目前路由位置：</div>
        <div className="route-info-value">{location.pathname}</div>
      </div>
    </div>
  )
}

export default Page4
