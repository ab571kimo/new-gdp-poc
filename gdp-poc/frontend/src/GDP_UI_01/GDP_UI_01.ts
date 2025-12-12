// GDP_UI_01 相關型別定義和邏輯函式
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
