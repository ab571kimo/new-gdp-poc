import { useState } from 'react';
import './Sidebar.css';

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

interface SidebarProps {
  menuGroups: MenuGroup[];
  selectedPageId: string | null;
  onPageSelect: (page: Page) => void;
}

function Sidebar({ menuGroups, selectedPageId, onPageSelect }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const handlePageClick = (page: Page) => {
    // 判斷頁面是否可點選（必須有 iframeId 或 pageUrl）
    if (page.iframeId || page.pageUrl) {
      onPageSelect(page);
    }
  };

  // 判斷頁面是否可點選
  const isPageClickable = (page: Page) => {
    return !!(page.iframeId || page.pageUrl);
  };

  if (menuGroups.length === 0) {
    return (
      <aside className="sidebar empty">
        選單載入中或無選單資料
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      {menuGroups.map((menuGroup) => {
        const isExpanded = expandedMenus.has(menuGroup.menuId);
        return (
          <div key={menuGroup.menuId} className="menu-group">
            <div
              className="menu-title"
              onClick={() => toggleMenu(menuGroup.menuId)}
            >
              <span className={`menu-title-icon ${isExpanded ? 'expanded' : ''}`}>
                ▶
              </span>
              {menuGroup.menuName}
            </div>
            <div className={`menu-items ${isExpanded ? 'active' : ''}`}>
              {menuGroup.pages.map((page) => (
                <div
                  key={page.pageId}
                  className={`menu-item ${
                    selectedPageId === page.pageId ? 'selected' : ''
                  } ${!isPageClickable(page) ? 'disabled' : ''}`}
                  onClick={() => handlePageClick(page)}
                >
                  {page.pageName}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </aside>
  );
}

export default Sidebar;
