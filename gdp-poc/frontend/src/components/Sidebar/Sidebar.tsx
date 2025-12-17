/**
 * Sidebar Component
 * 左側選單組件，從 API 取得選單資料並顯示
 * GDP_FC_001 - 讀取選單結構
 */

import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

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

const Sidebar: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const location = useLocation()

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      const response = await fetch('/api/menu/structure')
      if (!response.ok) {
        console.error('Failed to fetch menu data')
        setMenuData([])
        return
      }
      const result: MenuStructureResponse = await response.json()
      setMenuData(result.menuGroups)
    } catch (err) {
      console.error('Error fetching menu:', err)
      setMenuData([])
    } finally {
      setLoading(false)
    }
  }

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) {
        newSet.delete(menuId)
      } else {
        newSet.add(menuId)
      }
      return newSet
    })
  }

  const handlePageClick = (page: PageData, e: React.MouseEvent) => {
    // 只處理有 url 的項目
    if (!page.url) {
      e.preventDefault()
      return
    }

    // 檢查是否為外部連結
    if (page.url.startsWith('http://') || page.url.startsWith('https://')) {
      e.preventDefault()
      window.location.href = page.url
    }
    // 內部連結讓 React Router 處理
  }

  const isPageClickable = (page: PageData): boolean => {
    return !!page.url
  }

  if (loading) {
    return <aside className="sidebar"></aside>
  }

  if (menuData.length === 0) {
    return <aside className="sidebar"></aside>
  }

  return (
    <aside className="sidebar">
      {menuData.map((group) => (
        <div key={group.menu_id} className="menu-group">
          <div 
            className="menu-title" 
            onClick={() => toggleMenu(group.menu_id)}
          >
            {expandedMenus.has(group.menu_id) ? '▼' : '▶'} {group.menu_name}
          </div>
          <div className={`menu-items ${expandedMenus.has(group.menu_id) ? 'active' : ''}`}>
            {group.pages.map((page) => (
              <div
                key={page.page_id}
                className={`menu-item ${!isPageClickable(page) ? 'disabled' : ''} ${
                  page.url && location.pathname === page.url ? 'selected' : ''
                }`}
              >
                {isPageClickable(page) ? (
                  <Link
                    to={page.url!}
                    onClick={(e) => handlePageClick(page, e)}
                  >
                    {page.page_name}
                  </Link>
                ) : (
                  <span>{page.page_name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
    </aside>
  )
}

export default Sidebar
