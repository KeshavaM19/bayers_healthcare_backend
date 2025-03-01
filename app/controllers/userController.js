const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return sendResponse(res, 401, false, 'No token, authorization denied');
  
  if (!token.startsWith('Bearer ')) {
    return sendResponse(res, 401, false, 'Token format is invalid');
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, 401, false, 'Token is not valid');
  }
};

const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

// Get User Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.user.user_id }).select('-password');
    if (!user) return sendResponse(res, 404, false, 'User not found');
    sendResponse(res, 200, true, 'User profile retrieved', user);
  } catch (error) {
    sendResponse(res, 500, false, 'Server error', error.message);
  }
});

// ✅ Correct export: Export only the router
module.exports = router;

// ✅ (Optional) If you need `authMiddleware` in other files
module.exports.authMiddleware = authMiddleware;
