const express = require("express");
const authController = require('../cotrollers/auth-controller')
const authenticatedMiddleware = require('../middlewares/authenticate')

const router = express.Router();


router.post("/register", authController.register)
router.post("/login", authController.login)
router.post('/logout', authController.logout)
router.get('/getMe',authenticatedMiddleware, authController.getMe)

module.exports = router;