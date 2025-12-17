/**
 * Layout Component
 * 包含 Header、Sidebar 和內容區域的布局組件
 */

import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar.tsx'

const Layout: React.FC = () => {
  return (
    <div className="App">
      <header className="app-header">
        <h1>
          <Link to="/">GDP POC 系統</Link>
        </h1>
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
