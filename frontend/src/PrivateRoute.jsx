import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token'); // Проверяем наличие токена
  return token ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;