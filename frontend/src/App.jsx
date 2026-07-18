import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Auth from './pages/Auth'
function App() {

  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<Auth/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
