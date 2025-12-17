/**
 * Layout Component
 * 包含Header、Sidebar和內容區域的布局組件
 */

import React, { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import Sidebar from './Sidebar'

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="App">
      <header className="app-header">
        <h1><Link to="/homepage" style={{ textDecoration: 'none', color: 'inherit' }}>📋 Template Real - Menu Demo</Link></h1>
      </header>
      <div className="app-body">
        <Sidebar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
