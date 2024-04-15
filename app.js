
const users = [
    { id: 1, username: 'alice', password: 'password123' },
    // Add more users if needed
];

// app.js (or similar)
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const app = express();
const PORT = 3000;
const SECRET = 'my-super-strong-secret'; // Use a strong secret in production

app.use(express.json());
app.use(cors())
// Login route (simulated for simplicity)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Authenticate the user (in reality, you'd check a database)
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.sendStatus(401); // Unauthorized
    }

    // Create a JWT
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' }); 
    res.json({ token });
});

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You have accessed the protected resource.', user: req.user });
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(authHeader)
    if (!token) return res.sendStatus(401); 

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

