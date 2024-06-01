const { Router } = require('express')
const { registerUser, login, logout } = require('./../../controllers/login.controller')

const router = Router();

router.post('/login', login)
router.post('/registerUser', registerUser)
router.post('/logout', logout)


module.exports = router;