const auth = require("./auth.route");
const transaction = require("./transaction.route");
const card = require("./card.route");

module.exports = [auth, transaction, card];