import React from 'react'
import { Routes, Route } from 'react-router-dom'
import UserNamePage from './pages/UserNamePage'
import ChatPage from './pages/ChatPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserNamePage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}

export default App