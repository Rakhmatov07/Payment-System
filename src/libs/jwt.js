const Jwt = require("jsonwebtoken");
const config = require("../../config/index");

const sign = (payload) => Jwt.sign(payload, config.jwtkey);
const verify = (payload) => Jwt.verify(payload, config.jwtkey) ;

module.exports = {
    sign,
    verify
};

