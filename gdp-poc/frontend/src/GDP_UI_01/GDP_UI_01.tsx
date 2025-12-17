/**
 * GDP_UI_01 - 系統首頁
 * 顯示歡迎標語
 */

import React from 'react'
import './GDP_UI_01.css'

const GDP_UI_01: React.FC = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-message">
        <h1>歡迎使用 GDP POC 系統</h1>
        <p>請從左側選單選擇功能頁面</p>
      </div>
    </div>
  )
}

export default GDP_UI_01
