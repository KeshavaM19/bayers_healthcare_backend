const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

// const userRoutes = require('./routes/userRoutes');
const userRoutes = require('./app/controllers/userController');
const authRoutes = require('./app/controllers/authController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(router);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/users', userRoutes);
app.use('/auth', authRoutes);


// Routes
//app.use('/auth', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));
//app.use('/users', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));


app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

module.exports = app;
