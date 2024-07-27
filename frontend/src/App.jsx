import { useState } from 'react'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Dashboard } from './pages/Dashboard'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Transfer } from './pages/Transfer'
import { TransactionHistory } from './pages/TransactionHistory'
import { Verify } from './pages/Verify.jsx'



function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/transfer' element={<Transfer/>} />
        <Route path='/transactionhistory' element={<TransactionHistory/>} />
        <Route path='/verify' element={<Verify/>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
