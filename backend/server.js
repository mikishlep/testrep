const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключено к базе данных');
});

app.post('/signup', async (req, res) => {
    try {
        const { realname, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO login (`name`, `login`, `password`) VALUES (?, ?, ?)";
        const values = [realname, username, hashedPassword];

        db.query(sql, values, (err) => {
            if (err) {
                console.error('Ошибка выполнения запроса:', err);
                return res.status(500).json("Error");
            }
            res.status(201).json('Success');
        });
    } catch (error) {
        console.error('Ошибка обработки запроса:', error);
        res.status(500).json("Error");
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM login WHERE `login` = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            return res.status(500).json("Error");
        }

        if (results.length === 0) {
            return res.status(401).json('Fail');
        }

        const user = results[0];

        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ token });
            } else {
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

// Обработка карточек
app.get('/cards', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const sql = 'SELECT * FROM user_cards WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json("Error");
        res.json(results);
    });
});

app.post('/cards', authenticateToken, (req, res) => {
    const { title, count } = req.body;
    const userId = req.user.userId;
    const sql = 'INSERT INTO user_cards (title, count, user_id) VALUES (?, ?, ?)';
    db.query(sql, [title, count, userId], (err, result) => {
        if (err) return res.status(500).json("Error");
        res.json({ id: result.insertId });
    });
});

app.put('/cards/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, count } = req.body;
    const userId = req.user.userId;

    // Проверка и установка значений только для не-null/undefined полей
    const fields = [];
    const values = [];

    if (title !== undefined) {
        fields.push('title = ?');
        values.push(title);
    }

    if (count !== undefined) {
        // Установка счётчика только если он >= 0
        if (count < 0) {
            return res.status(400).json("Invalid count value");
        }
        fields.push('count = ?');
        values.push(count);
    }

    if (fields.length === 0) {
        return res.status(400).json("No fields to update");
    }

    values.push(id, userId);

    const sql = `UPDATE user_cards SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    db.query(sql, values, (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json("Error");
        }
        res.json('Success');
    });
});

// Удаление карточек с отрицательным счётчиком
app.delete('/cards/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const checkSql = 'SELECT count FROM user_cards WHERE id = ? AND user_id = ?';
    db.query(checkSql, [id, userId], (err, results) => {
        if (err) return res.status(500).json("Error");
        if (results.length === 0) return res.status(404).json("Card not found");

        const card = results[0];
        if (card.count <= 0) {
            const deleteSql = 'DELETE FROM user_cards WHERE id = ? AND user_id = ?';
            db.query(deleteSql, [id, userId], (err) => {
                if (err) return res.status(500).json("Error");
                res.json('Success');
            });
        } else {
            res.status(400).json("Card count is not negative or zero");
        }
    });
});

app.listen(8081, () => {
    console.log('Server is running on port 8081');
});