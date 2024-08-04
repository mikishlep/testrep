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

        const sql = "INSERT INTO login (name, login, password) VALUES (?, ?, ?)";
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

    const sql = "SELECT * FROM login WHERE login = ?";
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

// Создание нового проекта
app.post('/projects', authenticateToken, (req, res) => {
    const { title } = req.body;
    const userId = req.user.userId;
    const sql = 'INSERT INTO projects (title, user_id) VALUES (?, ?)';
    db.query(sql, [title, userId], (err, result) => {
        if (err) return res.status(500).json("Error");
        res.json({ id: result.insertId });
    });
});

// Получение проектов пользователя
app.get('/projects', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const sql = 'SELECT * FROM projects WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json("Error");
        res.json(results);
    });
});

// Обновление проекта
app.put('/projects/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const sql = 'UPDATE projects SET title = ? WHERE id = ? AND user_id = ?';
    db.query(sql, [title, id, req.user.userId], (err) => {
        if (err) return res.status(500).json("Error");
        res.json('Success');
    });
});

// Удаление проекта
app.delete('/projects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        // Удаление всех расходов, связанных с проектом
        const deleteExpensesSql = 'DELETE FROM expenses WHERE project_id = ?';
        await new Promise((resolve, reject) => {
            db.query(deleteExpensesSql, [id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Удаление проекта
        const deleteProjectSql = 'DELETE FROM projects WHERE id = ? AND user_id = ?';
        await new Promise((resolve, reject) => {
            db.query(deleteProjectSql, [id, userId], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        res.json('Success');
    } catch (err) {
        console.error('Ошибка при удалении проекта:', err);
        res.status(500).json('Error');
    }
});

// Добавление расхода
app.post('/expenses', authenticateToken, (req, res) => {
    const { projectId, name, amount, price, sum } = req.body;
    const sql = 'INSERT INTO expenses (project_id, name, amount, price, sum) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [projectId, name, amount, price, sum], (err, result) => {
        if (err) return res.status(500).json("Error");
        res.json({ id: result.insertId });
    });
});

// Получение расходов по проекту
app.get('/expenses/:projectId', authenticateToken, (req, res) => {
    const { projectId } = req.params;
    const sql = 'SELECT * FROM expenses WHERE project_id = ?';
    db.query(sql, [projectId], (err, results) => {
        if (err) return res.status(500).json("Error");
        res.json(results);
    });
});

// Обновление расхода
app.put('/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, amount, price, sum } = req.body;
    const fields = [];
    const values = [];

    if (name !== undefined) {
        fields.push('name = ?');
        values.push(name);
    }

    if (amount !== undefined) {
        if (amount < 0) return res.status(400).json("Invalid amount value");
        fields.push('amount = ?');
        values.push(amount);
    }

    if (price !== undefined) {
        if (price < 0) return res.status(400).json("Invalid price value");
        fields.push('price = ?');
        values.push(price);
    }

    if (sum !== undefined) {
        if (sum < 0) return res.status(400).json("Invalid sum value");
        fields.push('sum = ?');
        values.push(sum);
    }

    if (fields.length === 0) return res.status(400).json("No fields to update");

    values.push(id);

    const sql = `UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`;
    db.query(sql, values, (err) => {
        if (err) return res.status(500).json("Error");
        res.json('Success');
    });
});

// Удаление расхода
app.delete('/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM expenses WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json("Error");
        res.json('Success');
    });
});

// Create a new dashboard record
app.post('/dashboard-stat', authenticateToken, (req, res) => {
    const { month, grossProfit, netProfit } = req.body;
    const userId = req.user.userId;
    const sql = 'INSERT INTO dashboard_stat (month, grossProfit, netProfit, year, user_id) VALUES (?, ?, ?, ?, ?)';
    const year = new Date().getFullYear();
    db.query(sql, [month, grossProfit, netProfit, year, userId], (err, result) => {
        if (err) return res.status(500).json("Error");
        res.json({ id: result.insertId });
    });
});

// Get all dashboard records for the user
app.get('/dashboard-stat', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const sql = 'SELECT * FROM dashboard_stat WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json("Error");
        res.json(results);
    });
});

app.delete('/dashboard-stat/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    // Проверяем существование записи перед удалением
    const checkSql = 'SELECT * FROM dashboard_stat WHERE id = ? AND user_id = ?';
    db.query(checkSql, [id, userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json("Error");
        }
        if (results.length === 0) {
            return res.status(404).json("Record not found");
        }

        // Удаление записи
        const deleteSql = 'DELETE FROM dashboard_stat WHERE id = ? AND user_id = ?';
        db.query(deleteSql, [id, userId], (err) => {
            if (err) {
                console.error('Error deleting record:', err);
                return res.status(500).json("Error");
            }
            res.json('Success');
        });
    });
});

// Создание заметки
app.post('/notes', authenticateToken, (req, res) => {
    const { note } = req.body;
    const userId = req.user.userId;
    const sql = 'INSERT INTO user_notes (user_id, note) VALUES (?, ?)';
    db.query(sql, [userId, note], (err, result) => {
        if (err) return res.status(500).json("Error");
        res.json({ id: result.insertId });
    });
});

// Получение всех заметок пользователя
app.get('/notes', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const sql = 'SELECT * FROM user_notes WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json("Error");
        res.json(results);
    });
});

// Обновление заметки
app.put('/notes/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { note } = req.body;
    const sql = 'UPDATE user_notes SET note = ? WHERE id = ? AND user_id = ?';
    db.query(sql, [note, id, req.user.userId], (err) => {
        if (err) return res.status(500).json("Error");
        res.json('Success');
    });
});

// Удаление заметки
app.delete('/notes/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM user_notes WHERE id = ? AND user_id = ?';
    db.query(sql, [id, req.user.userId], (err) => {
        if (err) return res.status(500).json("Error");
        res.json('Success');
    });
});

app.listen(8081, () => {
    console.log('Server is running on port 8081');
});