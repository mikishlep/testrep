import React from 'react'
import Login from './reglog/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './reglog/Signup'
import Home from './homepage/Home'
import PrivateRoute from './PrivateRoute'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/home' element={<PrivateRoute element={<Home />} />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
