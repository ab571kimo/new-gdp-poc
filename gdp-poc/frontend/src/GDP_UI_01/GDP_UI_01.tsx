import { useState, useEffect } from 'react';
import Header from '../components/Header/Header.tsx';
import Sidebar, { MenuGroup, Page } from '../components/Sidebar/Sidebar.tsx';
import { fetchMenuStructure } from '../components/Sidebar/Sidebar.ts';
import GDP_UI_02 from '../GDP_UI_02/GDP_UI_02.tsx';
import './GDP_UI_01.css';

function GDP_UI_01() {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  // 系統載入時自動取得選單結構 (GDP_FC_001)
  useEffect(() => {
    const loadMenuStructure = async () => {
      const data = await fetchMenuStructure();
      setMenuGroups(data.menuGroups);
    };

    loadMenuStructure();
  }, []);

  // 處理 Header 標題點擊，回到首頁
  const handleTitleClick = () => {
    setSelectedPage(null);
  };

  // 處理選單項目點擊
  const handlePageSelect = (page: Page) => {
    setSelectedPage(page);
  };

  return (
    <div className="gdp-ui-01">
      <Header onTitleClick={handleTitleClick} />
      <div className="main-container">
        <Sidebar
          menuGroups={menuGroups}
          selectedPageId={selectedPage?.pageId || null}
          onPageSelect={handlePageSelect}
        />
        <main className="content-area">
          {selectedPage ? (
            <GDP_UI_02 page={selectedPage} />
          ) : (
            <div className="welcome-message">
              <h1>歡迎使用 GDP POC 系統</h1>
              <p>請從左側選單選擇功能頁面</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default GDP_UI_01;
