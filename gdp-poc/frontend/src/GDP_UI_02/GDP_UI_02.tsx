import { useEffect } from 'react';
import './GDP_UI_02.css';

interface Page {
  pageId: string;
  pageName: string;
  pageNo: number;
  iframeId?: string;
  pageUrl?: string;
}

interface GDP_UI_02Props {
  page: Page;
}

function GDP_UI_02({ page }: GDP_UI_02Props) {
  // 判斷顯示模式
  const isEmbedMode = !!page.iframeId;
  const isUrlMode = !page.iframeId && !!page.pageUrl;

  // 如果是 URL 導頁模式，執行頁面導向
  useEffect(() => {
    if (isUrlMode && page.pageUrl) {
      // 在當前視窗開啟新頁面
      window.location.href = page.pageUrl;
    }
  }, [isUrlMode, page.pageUrl]);

  return (
    <div className="gdp-ui-02">
      <div className="page-header">
        <h1>
          {page.pageName}
          <span
            className={`page-type-indicator ${
              isEmbedMode ? 'embed-type-indicator' : 'url-type-indicator'
            }`}
          >
            {isEmbedMode ? '內嵌模式' : 'URL導頁模式'}
          </span>
        </h1>
      </div>

      <div className="page-content">
        {isEmbedMode ? (
          <>
            <div className="content-section">
              <h2>內嵌頁面說明</h2>
              <p>此頁面內容直接嵌入在右側顯示區域中，不會進行頁面跳轉或開啟新視窗。</p>
              <p>使用者可以在同一個系統框架內瀏覽所有功能，保持操作連貫性。</p>
            </div>

            <div className="content-section">
              <h2>模擬嵌入內容</h2>
              <div className="embedded-content">
                <h3>嵌入式內容區塊 (iframeId: {page.iframeId})</h3>
                <p>這裡可以放置實際的功能頁面內容，例如：</p>
                <ul>
                  <li>表單輸入介面</li>
                  <li>資料查詢結果</li>
                  <li>圖表與統計資料</li>
                  <li>各種業務功能元件</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="content-section">
              <h2>URL 導頁說明</h2>
              <p>此頁面將根據選單結構中的參數進行 URL 導向。</p>
              <p>系統會將使用者導向至指定的外部連結或獨立頁面。</p>
            </div>

            <div className="url-redirect-notice">
              <p>
                <strong>⚠ 導頁提示</strong>
              </p>
              <p style={{ marginTop: '10px' }}>
                實際運作時，此處會執行頁面跳轉行為：
              </p>
              <ul>
                <li>在當前視窗開啟新頁面</li>
                <li>導向目標: {page.pageUrl}</li>
              </ul>
            </div>

            <div className="content-section" style={{ marginTop: '25px' }}>
              <h2>應用場景</h2>
              <p>URL 導頁適用於以下情境：</p>
              <ul>
                <li>連結至外部系統或服務</li>
                <li>開啟獨立運作的功能頁面</li>
                <li>導向需要完整視窗空間的應用</li>
                <li>整合第三方工具或儀表板</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GDP_UI_02;
