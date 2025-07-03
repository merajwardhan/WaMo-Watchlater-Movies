import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './css/App.css'
import Home from './pages/Home'
import Favorites from './pages/favorites.jsx';
import Saved from './pages/save.jsx'
import NavBar from './components/NavBar.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
  <>
    <NavBar />
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
