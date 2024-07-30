import React, { useState } from 'react'
import './css/style.css'
import { Link } from 'react-router-dom';

function Signup() {
  const [realname, setRealname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Логин:', username);
    console.log('Пароль:', password);
  };

  return (
    <main>
        <div className="auth-bg">
            <div id="auth" className="auth">
                <h2 className="form--el">Авторизация</h2>
                <form id="loginForm" className="login" onSubmit={handleSubmit}>
                <div className="form--el">
                        <input 
                            type="text" 
                            id="realname" 
                            placeholder="Имя" 
                            value={realname}
                            onChange={(e) => setRealname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form--el">
                        <input 
                            type="text" 
                            id="username" 
                            placeholder="Логин" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form--el">
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Пароль" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form--el">
                        <button type="submit" className="hero-btn">Войти</button>
                    </div>    
                    <Link to="/" style={{textDecoration: 'none'}}>Не с нами?</Link>
                </form>
            </div>
        </div>
    </main>
  );
}

export default Signup