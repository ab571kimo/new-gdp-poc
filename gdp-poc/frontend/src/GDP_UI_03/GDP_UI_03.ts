/**
 * GDP_UI_03 - 選單管理頁面
 * GDP_FC_002 - 讀取選單管理資料
 * GDP_FC_003 - 管理與確定選單結構變更
 */

export interface PageData {
  page_id: string
  page_name: string
  page_no: number
  menu_id: string
  dashboard_id: string | null
  url: string | null
  genie_id: string | null
}

export interface MenuGroup {
  menu_id: string
  menu_name: string
  menu_no: number
  pages: PageData[]
}

export interface MenuStructureResponse {
  menuGroups: MenuGroup[]
}

export interface BatchUpdateRequest {
  menuGroups: MenuGroup[]
}

export interface ValidationError {
  field: string
  message: string
}

/**
 * 驗證選單名稱
 */
export const validateMenuName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return '選單名稱不可為空白'
  }
  if (name.length > 50) {
    return '選單名稱長度不可超過 50 個字元'
  }
  return null
}

/**
 * 驗證頁面名稱
 */
export const validatePageName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return '頁面名稱不可為空白'
  }
  if (name.length > 50) {
    return '頁面名稱長度不可超過 50 個字元'
  }
  return null
}

/**
 * 驗證 Dashboard ID
 */
export const validateDashboardId = (id: string | null): string | null => {
  if (id && id.length > 200) {
    return 'DASHBOARDID 長度不可超過 200 個字元'
  }
  return null
}

/**
 * 驗證 URL
 */
export const validateUrl = (url: string | null): string | null => {
  if (url && url.length > 200) {
    return 'URL 長度不可超過 200 個字元'
  }
  return null
}

/**
 * 驗證 Genie ID
 */
export const validateGenieId = (id: string | null): string | null => {
  if (id && id.length > 200) {
    return 'GENIEID 長度不可超過 200 個字元'
  }
  return null
}

/**
 * 驗證整個選單結構
 */
export const validateMenuStructure = (menuGroups: MenuGroup[]): ValidationError[] => {
  const errors: ValidationError[] = []

  menuGroups.forEach((group, groupIndex) => {
    const menuNameError = validateMenuName(group.menu_name)
    if (menuNameError) {
      errors.push({
        field: `menu_${group.menu_id}_name`,
        message: `選單 ${groupIndex + 1}: ${menuNameError}`
      })
    }

    group.pages.forEach((page, pageIndex) => {
      const pageNameError = validatePageName(page.page_name)
      if (pageNameError) {
        errors.push({
          field: `page_${page.page_id}_name`,
          message: `選單 ${groupIndex + 1} - 頁面 ${pageIndex + 1}: ${pageNameError}`
        })
      }

      const dashboardIdError = validateDashboardId(page.dashboard_id)
      if (dashboardIdError) {
        errors.push({
          field: `page_${page.page_id}_dashboard_id`,
          message: `選單 ${groupIndex + 1} - 頁面 ${pageIndex + 1}: ${dashboardIdError}`
        })
      }

      const urlError = validateUrl(page.url)
      if (urlError) {
        errors.push({
          field: `page_${page.page_id}_url`,
          message: `選單 ${groupIndex + 1} - 頁面 ${pageIndex + 1}: ${urlError}`
        })
      }

      const genieIdError = validateGenieId(page.genie_id)
      if (genieIdError) {
        errors.push({
          field: `page_${page.page_id}_genie_id`,
          message: `選單 ${groupIndex + 1} - 頁面 ${pageIndex + 1}: ${genieIdError}`
        })
      }
    })
  })

  return errors
}

/**
 * 取得選單結構資料
 */
export const fetchMenuStructure = async (): Promise<MenuStructureResponse> => {
  const response = await fetch('/api/menu/structure')
  if (!response.ok) {
    throw new Error('讀取選單資料失敗')
  }
  return await response.json()
}

/**
 * 批次更新選單結構
 */
export const batchUpdateMenuStructure = async (data: BatchUpdateRequest): Promise<void> => {
  const response = await fetch('/api/menu/structure/batch-update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '確定失敗')
  }
}
