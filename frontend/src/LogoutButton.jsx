import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem('token');
    // Перенаправляем на страницу логина
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Выйти
    </button>
  );
};

export default LogoutButton;