import React, { useState } from 'react';
import '../css/style.css';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';

function Signup() {
    const [values, setValues] = useState({
        realname: '',
        username: '',
        password: ''
    });

    const navigate = useNavigate();
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
            axios.post('http://localhost:8081/signup', values)
                .then(res => {
                    console.log('Response from server:', res.data);
                    if (res.data === "Success") {
                        navigate('/');
                    } else {
                        alert('Ошибка регистрации');
                    }
                })
                .catch(err => {
                    console.error('Error from server:', err);
                    alert('Ошибка сервера при регистрации');
                });
        }
    };

    return (
        <main>
            <div className="auth-bg">
                <div id="auth" className="auth">
                    <h2 className="form--el">Регистрация</h2>
                    <form id="signupForm" className="signup" onSubmit={handleSubmit}>
                        <div className="form--el">
                            <input
                                type="text"
                                name="realname"
                                placeholder="Имя"
                                value={values.realname}
                                onChange={handleInput}
                                maxLength={15}
                                required
                            />
                            {errors.realname && <span className="errroCode">{errors.realname}</span>}
                        </div>
                        <div className="form--el">
                            <input
                                type="text"
                                name="username"
                                placeholder="Логин"
                                value={values.username}
                                onChange={handleInput}
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
                                required
                            />
                            {errors.password && <span className="errroCode">{errors.password}</span>}
                        </div>
                        <div className="form--el">
                            <button type="submit" className="hero-btn">Зарегистрироваться</button>
                        </div>
                        <Link to="/" style={{ textDecoration: 'none' }}>Уже с нами?</Link>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Signup;