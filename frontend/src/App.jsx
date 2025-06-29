import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home'
import Favorites from './pages/favorites.jsx';
import Saved from './pages/save.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
  <>
    <main className='mainContent'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/favorites' element={<Favorites/>} />
        <Route path='/saved' element={<Saved/>} />
      </Routes>
    </main>
  </>
  )
}

export default App
