import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';


function App() {

  return (

    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
          <Route path='/home' element={<Home/>} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/profile' element={<Profile />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;