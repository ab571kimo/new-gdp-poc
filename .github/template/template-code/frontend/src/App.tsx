/**
 * Template Real - Menu Demo App
 * 主應用程式組件
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import NotFound from './components/NotFound'
import HomePage from './pages/TEMP-UI-01/HomePage'
import Page2 from './pages/TEMP-UI-02/Page2'
import Page3 from './pages/TEMP-UI-03/Page3'
import Page4 from './pages/TEMP-UI-04/Page4'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/chatbot" element={<Page4 />} />
          <Route path="/dashboard" element={<Page2 />} />
          <Route path="/system-config" element={<Page3 />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
