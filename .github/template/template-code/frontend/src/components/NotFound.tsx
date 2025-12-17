/**
 * NotFound Component
 * 404 頁面組件
 */

import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">頁面不存在</h2>
        <p className="not-found-message">
          抱歉，您訪問的頁面不存在或已被移除。
        </p>
        <Link to="/homepage" className="not-found-button">
          返回首頁
        </Link>
      </div>
    </div>
  )
}

export default NotFound
