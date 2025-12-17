/**
 * GDP_UI_03 - 選單管理頁面
 * GDP_FC_002 - 讀取選單管理資料
 * GDP_FC_003 - 管理與確定選單結構變更
 */

import React, { useState, useEffect } from 'react'
import {
  MenuGroup,
  PageData,
  validateMenuName,
  validatePageName,
  validateDashboardId,
  validateUrl,
  validateGenieId,
  validateMenuStructure,
  fetchMenuStructure,
  batchUpdateMenuStructure
} from './GDP_UI_03.ts'
import './GDP_UI_03.css'

const GDP_UI_03: React.FC = () => {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const [editingMenu, setEditingMenu] = useState<string | null>(null)
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchMenuStructure()
      setMenuGroups(data.menuGroups)
      // 預設展開所有選單
      setExpandedMenus(new Set(data.menuGroups.map(g => g.menu_id)))
    } catch (err) {
      console.error('Error loading menu data:', err)
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          setError('網路連線異常，請檢查網路後重試')
        } else if (err.message.includes('無回應')) {
          setError('系統服務無回應，請聯繫系統管理員')
        } else {
          setError('讀取選單資料失敗，請稍後再試')
        }
      } else {
        setError('讀取選單資料失敗，請稍後再試')
      }
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

  const startEditMenu = (menuId: string) => {
    setEditingMenu(menuId)
  }

  const cancelEditMenu = () => {
    setEditingMenu(null)
  }

  const saveEditMenu = (menuId: string, newName: string) => {
    const error = validateMenuName(newName)
    if (error) {
      alert(error)
      return
    }

    setMenuGroups(prev =>
      prev.map(menu =>
        menu.menu_id === menuId ? { ...menu, menu_name: newName } : menu
      )
    )
    setEditingMenu(null)
    setHasChanges(true)
  }

  const startEditPage = (pageId: string) => {
    setEditingPage(pageId)
  }

  const cancelEditPage = () => {
    setEditingPage(null)
  }

  const saveEditPage = (
    menuId: string,
    pageId: string,
    updates: Partial<PageData>
  ) => {
    // 驗證
    if (updates.page_name !== undefined) {
      const error = validatePageName(updates.page_name)
      if (error) {
        alert(error)
        return
      }
    }

    if (updates.dashboard_id !== undefined) {
      const error = validateDashboardId(updates.dashboard_id)
      if (error) {
        alert(error)
        return
      }
    }

    if (updates.url !== undefined) {
      const error = validateUrl(updates.url)
      if (error) {
        alert(error)
        return
      }
    }

    if (updates.genie_id !== undefined) {
      const error = validateGenieId(updates.genie_id)
      if (error) {
        alert(error)
        return
      }
    }

    setMenuGroups(prev =>
      prev.map(menu =>
        menu.menu_id === menuId
          ? {
              ...menu,
              pages: menu.pages.map(page =>
                page.page_id === pageId ? { ...page, ...updates } : page
              )
            }
          : menu
      )
    )
    setEditingPage(null)
    setHasChanges(true)
  }

  const moveMenuUp = (menuId: string) => {
    const index = menuGroups.findIndex(m => m.menu_id === menuId)
    if (index > 0) {
      const newGroups = [...menuGroups]
      ;[newGroups[index - 1], newGroups[index]] = [newGroups[index], newGroups[index - 1]]
      // 重新編號
      newGroups.forEach((menu, idx) => {
        menu.menu_no = idx + 1
      })
      setMenuGroups(newGroups)
      setHasChanges(true)
    }
  }

  const moveMenuDown = (menuId: string) => {
    const index = menuGroups.findIndex(m => m.menu_id === menuId)
    if (index < menuGroups.length - 1) {
      const newGroups = [...menuGroups]
      ;[newGroups[index], newGroups[index + 1]] = [newGroups[index + 1], newGroups[index]]
      // 重新編號
      newGroups.forEach((menu, idx) => {
        menu.menu_no = idx + 1
      })
      setMenuGroups(newGroups)
      setHasChanges(true)
    }
  }

  const movePageUp = (menuId: string, pageId: string) => {
    setMenuGroups(prev =>
      prev.map(menu => {
        if (menu.menu_id === menuId) {
          const index = menu.pages.findIndex(p => p.page_id === pageId)
          if (index > 0) {
            const newPages = [...menu.pages]
            ;[newPages[index - 1], newPages[index]] = [newPages[index], newPages[index - 1]]
            // 重新編號
            newPages.forEach((page, idx) => {
              page.page_no = idx + 1
            })
            return { ...menu, pages: newPages }
          }
        }
        return menu
      })
    )
    setHasChanges(true)
  }

  const movePageDown = (menuId: string, pageId: string) => {
    setMenuGroups(prev =>
      prev.map(menu => {
        if (menu.menu_id === menuId) {
          const index = menu.pages.findIndex(p => p.page_id === pageId)
          if (index < menu.pages.length - 1) {
            const newPages = [...menu.pages]
            ;[newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]]
            // 重新編號
            newPages.forEach((page, idx) => {
              page.page_no = idx + 1
            })
            return { ...menu, pages: newPages }
          }
        }
        return menu
      })
    )
    setHasChanges(true)
  }

  const handleConfirmAllChanges = async () => {
    // 驗證所有資料
    const errors = validateMenuStructure(menuGroups)
    if (errors.length > 0) {
      alert('資料驗證失敗：\n' + errors.map(e => e.message).join('\n'))
      return
    }

    if (!confirm('確定要儲存所有變更嗎？')) {
      return
    }

    try {
      setSaving(true)
      await batchUpdateMenuStructure({ menuGroups })
      alert('變更已確定')
      setHasChanges(false)
      await loadMenuData()
    } catch (err) {
      console.error('Error saving changes:', err)
      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('網路')) {
          alert('網路連線異常，請檢查網路後重試')
        } else if (err.message.includes('無回應')) {
          alert('系統服務無回應，請聯繫系統管理員')
        } else {
          alert('確定失敗，請稍後再試')
        }
      } else {
        alert('確定失敗，請稍後再試')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-state">載入中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="management-container">
        <div className="error-state">{error}</div>
      </div>
    )
  }

  if (menuGroups.length === 0) {
    return (
      <div className="management-container">
        <div className="empty-state">目前無任何選單資料</div>
      </div>
    )
  }

  return (
    <div className="management-container">
      <div className="toolbar">
        <div className="toolbar-left">
          <button className="btn btn-secondary" onClick={loadMenuData} disabled={saving}>
            重新整理
          </button>
        </div>
        <div className="toolbar-right">
          <button
            className="btn btn-success"
            onClick={handleConfirmAllChanges}
            disabled={!hasChanges || saving}
          >
            {saving ? '儲存中...' : '✓ 確定全部變更'}
          </button>
        </div>
      </div>

      <div className="management-content">
        <ul className="menu-tree">
          {menuGroups.map((menu, menuIndex) => (
            <li key={menu.menu_id} className="management-menu-item">
              <div className="menu-header">
                <div className="management-menu-info">
                  <span
                    className="collapse-icon"
                    onClick={() => toggleMenu(menu.menu_id)}
                  >
                    {expandedMenus.has(menu.menu_id) ? '▼' : '▶'}
                  </span>
                  {editingMenu === menu.menu_id ? (
                    <input
                      type="text"
                      className="form-input"
                      defaultValue={menu.menu_name}
                      placeholder="請輸入選單名稱 (1-50字元)"
                      autoFocus
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          saveEditMenu(menu.menu_id, (e.target as HTMLInputElement).value)
                        }
                      }}
                    />
                  ) : (
                    <div className="management-menu-name">{menu.menu_name}</div>
                  )}
                </div>
                <div className="menu-actions">
                  {editingMenu === menu.menu_id ? (
                    <>
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={cancelEditMenu}
                      >
                        取消
                      </button>
                      <button
                        className="btn btn-small btn-success"
                        onClick={() => {
                          const input = document.querySelector(
                            `input[defaultValue="${menu.menu_name}"]`
                          ) as HTMLInputElement
                          if (input) {
                            saveEditMenu(menu.menu_id, input.value)
                          }
                        }}
                      >
                        確定
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="sort-controls">
                        <button
                          className="btn-icon"
                          onClick={() => moveMenuUp(menu.menu_id)}
                          disabled={menuIndex === 0}
                        >
                          ▲
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => moveMenuDown(menu.menu_id)}
                          disabled={menuIndex === menuGroups.length - 1}
                        >
                          ▼
                        </button>
                      </div>
                      <button
                        className="btn btn-small btn-primary"
                        onClick={() => startEditMenu(menu.menu_id)}
                      >
                        編輯
                      </button>
                    </>
                  )}
                </div>
              </div>

              {expandedMenus.has(menu.menu_id) && (
                <ul className="page-list">
                  {menu.pages.map((page, pageIndex) => (
                    <li
                      key={page.page_id}
                      className={`page-item ${
                        editingPage === page.page_id ? 'edit-mode' : ''
                      }`}
                    >
                      {editingPage === page.page_id ? (
                        <>
                          <div className="page-info">
                            <div className="page-field">
                              <div className="page-label">頁面名稱</div>
                              <input
                                type="text"
                                className="form-input"
                                defaultValue={page.page_name}
                                placeholder="請輸入頁面名稱 (1-50字元)"
                                id={`page_name_${page.page_id}`}
                              />
                            </div>
                            <div className="page-field">
                              <div className="page-label">DASHBOARDID</div>
                              <input
                                type="text"
                                className="form-input"
                                defaultValue={page.dashboard_id || ''}
                                placeholder="選填 (最多200字元)"
                                id={`dashboard_id_${page.page_id}`}
                              />
                            </div>
                            <div className="page-field">
                              <div className="page-label">URL</div>
                              <input
                                type="text"
                                className="form-input"
                                defaultValue={page.url || ''}
                                placeholder="選填 (最多200字元)"
                                id={`url_${page.page_id}`}
                              />
                            </div>
                            <div className="page-field">
                              <div className="page-label">GENIEID</div>
                              <input
                                type="text"
                                className="form-input"
                                defaultValue={page.genie_id || ''}
                                placeholder="選填 (最多200字元)"
                                id={`genie_id_${page.page_id}`}
                              />
                            </div>
                          </div>
                          <div className="page-actions">
                            <button
                              className="btn btn-small btn-secondary"
                              onClick={cancelEditPage}
                            >
                              取消
                            </button>
                            <button
                              className="btn btn-small btn-success"
                              onClick={() => {
                                const pageName = (
                                  document.getElementById(
                                    `page_name_${page.page_id}`
                                  ) as HTMLInputElement
                                ).value
                                const dashboardId = (
                                  document.getElementById(
                                    `dashboard_id_${page.page_id}`
                                  ) as HTMLInputElement
                                ).value
                                const url = (
                                  document.getElementById(
                                    `url_${page.page_id}`
                                  ) as HTMLInputElement
                                ).value
                                const genieId = (
                                  document.getElementById(
                                    `genie_id_${page.page_id}`
                                  ) as HTMLInputElement
                                ).value

                                saveEditPage(menu.menu_id, page.page_id, {
                                  page_name: pageName,
                                  dashboard_id: dashboardId || null,
                                  url: url || null,
                                  genie_id: genieId || null
                                })
                              }}
                            >
                              確定
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="page-info">
                            <div className="page-field">
                              <div className="page-label">頁面名稱</div>
                              <div className="page-value">{page.page_name}</div>
                            </div>
                            <div className="page-field">
                              <div className="page-label">DASHBOARDID</div>
                              <div className="page-value">
                                {page.dashboard_id || '-'}
                              </div>
                            </div>
                            <div className="page-field">
                              <div className="page-label">URL</div>
                              <div className="page-value">{page.url || '-'}</div>
                            </div>
                            <div className="page-field">
                              <div className="page-label">GENIEID</div>
                              <div className="page-value">{page.genie_id || '-'}</div>
                            </div>
                          </div>
                          <div className="page-actions">
                            <div className="sort-controls">
                              <button
                                className="btn-icon"
                                onClick={() => movePageUp(menu.menu_id, page.page_id)}
                                disabled={pageIndex === 0}
                              >
                                ▲
                              </button>
                              <button
                                className="btn-icon"
                                onClick={() =>
                                  movePageDown(menu.menu_id, page.page_id)
                                }
                                disabled={pageIndex === menu.pages.length - 1}
                              >
                                ▼
                              </button>
                            </div>
                            <button
                              className="btn btn-small btn-primary"
                              onClick={() => startEditPage(page.page_id)}
                            >
                              編輯
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default GDP_UI_03
