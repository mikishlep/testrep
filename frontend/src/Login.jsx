import React, { useState } from 'react';
import './css/style.css';
import { Link } from 'react-router-dom';
import Validation from './LoginValidation';

function Login() {
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Submitted values:', values);
      // Perform login or other submit actions here
    }
  };

  return (
    <main>
      <div className="auth-bg">
        <div id="auth" className="auth">
          <h2 className="form--el">Регистрация</h2>
          <form id="loginForm" className="login" onSubmit={handleSubmit}>
            <div className="form--el">
              <input 
                type="text" 
                name="username" 
                placeholder="Логин" 
                value={values.username}
                onChange={handleInput}
                maxLength={15}
                required
              />
              {errors.username && <span className="errroCode">{errors.username}</span>}
            </div>
            <div className="form--el">
              <input 
                type="password" 
                name="password"
                placeholder="Пароль" 
                value={values.password}
                onChange={handleInput}
                maxLength={15}
                required
              />
              {errors.password && <span className='errroCode'>{errors.password}</span>}
            </div>
            <div className="form--el">
              <button type="submit" className="hero-btn">Войти</button>
            </div>    
            <Link to="/signup" style={{ textDecoration: 'none' }}>Уже с нами?</Link>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;