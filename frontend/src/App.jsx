import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import {Toaster} from 'react-hot-toast';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
    <Toaster position='top-right' reverseOrder={false} />
    <Navbar />

      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<div>Profile</div>} />
      </Routes>


    </>
  )
}

export default App