/**
 * GDP POC 系統
 * 主應用程式組件
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout.tsx'
import GDP_UI_01 from './GDP_UI_01/GDP_UI_01.tsx'
import GDP_UI_02 from './GDP_UI_02/GDP_UI_02.tsx'
import GDP_UI_03 from './GDP_UI_03/GDP_UI_03.tsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GDP_UI_01 />} />
          <Route path="/page/:pageId" element={<GDP_UI_02 />} />
          <Route path="/admin/menu-management" element={<GDP_UI_03 />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
