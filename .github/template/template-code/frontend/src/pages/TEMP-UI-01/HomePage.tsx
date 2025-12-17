/**
 * HomePage Component
 * 首頁組件
 */

import React from 'react'
import { useLocation } from 'react-router-dom'
import './HomePage.css'

const HomePage: React.FC = () => {
  const location = useLocation()

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>🏠 首頁</h1>
        <p>歡迎來到 Template Real - Menu Demo</p>
      </div>

      <div className="home-content">
        <h2>系統說明</h2>
        <p>
          這是一個展示選單系統與路由功能的示範應用程式。
        </p>
        <p>
          您可以透過左側選單瀏覽不同的功能頁面，每個頁面都有獨立的組件與樣式。
        </p>
      </div>

      <div className="home-info">
        <h3>✨ 系統特色</h3>
        <ul>
          <li>使用 FastAPI 後端提供虛擬選單資料</li>
          <li>React Router 處理前端路由</li>
          <li>動態選單系統，支援多層級結構</li>
          <li>響應式設計，支援各種螢幕尺寸</li>
          <li>完整的前後端整合示例</li>
        </ul>
      </div>

      <div className="route-info">
        <div className="route-info-label">目前路由位置：</div>
        <div className="route-info-value">{location.pathname}</div>
      </div>
    </div>
  )
}

export default HomePage
