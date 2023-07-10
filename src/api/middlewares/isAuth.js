const Jwt = require("../../libs/jwt");
const { fetchOne } = require("../../libs/pg");


const isAuth = async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) return res.redirect('/auth/login');

        const {user_uid} = Jwt.verify(token);
        if(!user_uid) return res.redirect('/auth/login');

        const findUser = await fetchOne("SELECT * FROM users WHERE user_uid=$1", user_uid);
        if(!findUser) return res.redirect('/auth/login');

        req.user = findUser;
        next();

    } catch (error) {
        res.redirect('/auth/login');
    }
}

module.exports = isAuth;