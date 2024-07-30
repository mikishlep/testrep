const express = require('express');
const bodyParser = require('body-parser'); // Импортируем body-parser
const mysql = require('mysql'); // Импортируем mysql
const cors = require('cors');
const app = express();

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
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`name`, `login`, `password`) VALUES (?)";
    const values = [
        req.body.realname,
        req.body.username,
        req.body.password
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            return res.json("Error");
        }
        return res.json('Success');
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE `name` = ? AND `password` =  ?";
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            return res.json("Error");
        }
        // ДОПИЛИТЬ
        return res.json('Success');
        // ДОПИЛИТЬ
        
    });
});

// Запуск сервера на порту 8081
app.listen(8081, () => {
    console.log('Listening on port 8081...');
});