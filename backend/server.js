const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Используем body-parser для парсинга JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Настройка соединения с базой данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
});

// Подключение к базе данных
db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключено к базе данных');
});

// Обработка POST-запросов на /signup
app.post('/signup', async (req, res) => {
    try {
        const { realname, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`Registering user: ${username}`);

        const sql = "INSERT INTO login (`name`, `login`, `password`) VALUES (?, ?, ?)";
        const values = [realname, username, hashedPassword];

        db.query(sql, values, (err) => {
            if (err) {
                console.error('Ошибка выполнения запроса:', err);
                return res.status(500).json("Error");
            }
            console.log('User registered successfully');
            res.status(201).json('Success');
        });
    } catch (error) {
        console.error('Ошибка обработки запроса:', error);
        res.status(500).json("Error");
    }
});

// Обработка POST-запросов на /login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(`Attempting login for user: ${username}`);

    const sql = "SELECT * FROM login WHERE `login` = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            return res.status(500).json("Error");
        }

        console.log('Query results:', results);

        if (results.length === 0) {
            console.log('Пользователь не найден');
            return res.status(401).json('Fail');
        }

        const user = results[0];
        console.log('User found:', user);

        try {
            const match = await bcrypt.compare(password, user.password);
            console.log('Password match:', match);

            if (match) {
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log('Token generated:', token);
                return res.json({ token });
            } else {
                console.log('Password mismatch');
                return res.status(401).json('Fail');
            }
        } catch (err) {
            console.error('Ошибка при сравнении пароля:', err);
            return res.status(500).json("Error");
        }
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).send('Unauthorized');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Forbidden');
        req.user = user;
        next();
    });
}

// Пример защищенного маршрута
app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

// Запуск сервера на порту 8081
app.listen(8081, () => {
    console.log('Listening on port 8081...');
});