const express = require('express')
const router = express.Router()
const userController = require('../app/controllers/userController')
const {authenticateUser} = require('../app/middlewares/authentication')


// User
router.post('/users/register', userController)
router.post('/users/login', userController)
router.get('/users/account', authenticateUser, userController)



module.exports = router