const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, ...rest } = req.body;
    let user = await User.findOne({ email });
    if (user) return sendResponse(res, 400, false, 'User already exists');

    user = new User({
      user_id: new mongoose.Types.ObjectId().toString(),
      email,
      password,
      role,
      ...rest
    });

    await user.save();
    sendResponse(res, 201, true, 'User registered successfully');
  } catch (error) {
    sendResponse(res, 500, false, 'Server error', error.message);
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return sendResponse(res, 400, false, 'Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendResponse(res, 400, false, 'Invalid credentials');

    const payload = { user_id: user.user_id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    sendResponse(res, 200, true, 'Login successful', { token, user: { email: user.email, role: user.role } });
  } catch (error) {
    sendResponse(res, 500, false, 'Server error', error.message);
  }
});

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return sendResponse(res, 401, false, 'No token, authorization denied');
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, 401, false, 'Token is not valid');
  }
};

// Logout User (Token Blacklisting could be implemented in Redis for better security)
router.post('/logout', authMiddleware, (req, res) => {
  sendResponse(res, 200, true, 'User logged out successfully');
});

module.exports = { router, authMiddleware };
