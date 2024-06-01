const { Router } = require("express")
const router = Router();

const {  forgotPassword, resetPassword, resetPasswordFn } = require("./../../controllers/password.controller")

router.post("/forgot-password", forgotPassword)
router.get('/reset-password/:idUser/:tokenUser', resetPassword)
router.post('/reset-password/:idUser/:tokenUser', resetPasswordFn)


module.exports = router;