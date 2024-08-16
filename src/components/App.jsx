import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('jwt') !== null;
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated() ? "/home" : "/login"} />} />
          <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!isAuthenticated() ? <SignUp /> : <Navigate to="/home" />} />
          <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;