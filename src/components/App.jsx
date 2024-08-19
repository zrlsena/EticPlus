import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
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
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/home" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!isAuthenticated() ? <SignUp /> : <Navigate to="/home" />} />
          <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function HomeRedirect() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(false);

 
  const isAuthenticated = () => {
    return localStorage.getItem('jwt') !== null;
  };

  const checkServerStatus = async () => {
    try {
      const response = await fetch('/api/home', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        if (data.status === 500 && data.error === 'Internal Server Error') {
          setServerError(true);
          navigate('/login');  
        }
      }
    } catch (error) {
      setServerError(true);
      navigate('/login');  
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      checkServerStatus();  
    } else {
      navigate('/login');  
    }
  }, []);  

  if (serverError) {
    return <Navigate to="/login" />;
  }

  return isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />;
}

export default App;
