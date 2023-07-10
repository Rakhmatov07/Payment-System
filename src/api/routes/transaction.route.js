const { payment, transfer } = require("../controllers/transaction.controller");

const router = require("express").Router();

router.post('/payment', payment);
router.post('/transfer', transfer);

module.exports = router;