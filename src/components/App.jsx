import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import SignIn from '../pages/SignIn';
import Login from '../pages/Login';


function App() {

  return (

    <body>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/profile' element={<Profile />} />

        </Routes>
      </BrowserRouter>
    </body>
  );
}

export default App;