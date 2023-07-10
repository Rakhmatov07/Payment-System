const { register, login, logout } = require("../controllers/auth.controller");

const router = require("express").Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.delete('/auth/logout/:user_uid', logout);

module.exports = router;