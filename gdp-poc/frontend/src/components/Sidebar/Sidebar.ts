// API Response 類型定義
export interface Page {
  pageId: string;
  pageName: string;
  pageNo: number;
  iframeId?: string;
  pageUrl?: string;
}

export interface MenuGroup {
  menuId: string;
  menuName: string;
  menuNo: number;
  pages: Page[];
}

export interface MenuStructureResponse {
  menuGroups: MenuGroup[];
}

// API 呼叫函式
export async function fetchMenuStructure(): Promise<MenuStructureResponse> {
  try {
    const response = await fetch('/api/menu/structure');
    if (!response.ok) {
      throw new Error(`API 回應錯誤: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('取得選單結構失敗:', error);
    // 回傳空的選單結構
    return { menuGroups: [] };
  }
}
