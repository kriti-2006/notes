const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'Notes_db', // Replace with your MySQL username
    password: 'RAKESH', // Replace with your MySQL password
    database: 'UserAuth',
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Route for signup
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        const sql = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hash], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'User already exists' });
                }
                throw err;
            }
            res.status(200).json({ message: 'User registered successfully' });
        });
    });
});

// Route for login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM Users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            // Generate a token
            const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        });
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
