import './App.css'
import { useEffect } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import {authService} from './services/api/authService'
import {useSelector,useDispatch} from 'react-redux'

//pages
import Auth from './pages/Auth'
import Home from './pages/Home'
import Interview from './pages/interviewPage'


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
        <Route path='/interview' element={<Interview/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
