/**
 * Sidebar Component
 * 左側選單組件，從API取得選單資料並顯示
 */

import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

interface MenuItem {
  menuId: string
  menuName: string
  route: string
}

interface MenuGroup {
  menuId: string
  menuName: string
  children: MenuItem[]
}

interface MenuResponse {
  success: boolean
  data: MenuGroup[]
}

const Sidebar: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      const response = await fetch('/api/menu/list')
      if (!response.ok) {
        throw new Error('Failed to fetch menu data')
      }
      const result: MenuResponse = await response.json()
      if (result.success) {
        setMenuData(result.data)
      } else {
        throw new Error('API returned success: false')
      }
    } catch (err) {
      console.error('Error fetching menu:', err)
      setError('無法載入選單資料')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="sidebar">
        <div className="loading">載入選單中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sidebar">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <nav className="sidebar sidebar-container">
      {menuData.map((group) => (
        <div key={group.menuId} className="menu-group">
          <div className="menu-group-title">{group.menuName}</div>
          <ul className="menu-items">
            {group.children.map((item) => (
              <li key={item.menuId} className="menu-item">
                <Link
                  to={item.route}
                  className={`menu-item-link ${
                    location.pathname === item.route ? 'active' : ''
                  }`}
                >
                  {item.menuName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export default Sidebar
