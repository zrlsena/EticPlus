import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element: Element, ...rest }) {
  const token = localStorage.getItem('jwt');
  
  return token ? <Element {...rest} /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
