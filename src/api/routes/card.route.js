const { addCard, deleteCard } = require("../controllers/card.controller");
const isAuth = require("../middlewares/isAuth");

const router = require("express").Router();

router.post('/card/add', addCard);
router.delete('/card/delete/:card_uid', deleteCard);


module.exports = router;