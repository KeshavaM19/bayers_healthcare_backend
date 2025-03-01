require('dotenv').config(); // Move dotenv.config() to the top
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const userRoutes = require('./app/controllers/userController');
const authRoutes = require('./app/controllers/authController');

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Routes
// app.use('/auth', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));
// app.use('/users', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

module.exports = app;
