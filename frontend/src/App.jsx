import './App.css'
import { useEffect } from 'react'
import Home from './pages/Home'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Auth from './pages/Auth'
import {authService} from './services/api/authService'
import {useSelector,useDispatch} from 'react-redux'

function App() {
  const dispatch=useDispatch()
  useEffect(()=>{
    authService.getCurrentUser(dispatch).then((user)=>{
      console.log("Current User:", user);
    })
  },[dispatch])
  
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
