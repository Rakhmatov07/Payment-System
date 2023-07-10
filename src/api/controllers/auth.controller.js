const { sign } = require("../../libs/jwt");
const { hash_item, compare_item } = require("../../libs/bcrypt");
const { fetch, fetchOne } = require("../../libs/pg");

const register = async(req, res) => {
    try {
        const { firstname, lastname, phone_number, password } = req.body;
        const user = await fetchOne("SELECT * FROM users WHERE phone_number=$1;", phone_number);
        if(user){
            return res.status(409).json({message: 'Phone number is already used'});
            // return res.redirect("/register");
        };
        
        const hashed_pass = await hash_item(password);
        const newUser = await fetchOne("INSERT INTO users(firstname, lastname, phone_number, password) VALUES($1, $2, $3, $4) RETURNING*;", firstname, lastname, phone_number, hashed_pass);
        await fetchOne("INSERT INTO cashback_cards(balance, user_uid) VALUES($1, $2);", 0, newUser.user_uid);
        const token = sign(newUser.user_uid);

        res.status(201).json({message: "Created", token});
        // res.cookie("token", token);
        // res.redirect("/index");
    } catch (error) {
        console.log(error);
        // res.redirect("/register");
    }
};

const login = async(req, res) => {
    try {
        const { phone_number, password } = req.body;
        const user = await fetchOne("SELECT * FROM users WHERE phone_number=$1;", phone_number);
        
        if(!user){
            return res.status(404).json({message: 'Phone number or password is wrong!'});
            // return res.redirect("/login");
        };

        const compare_pass = await compare_item(password, user.password);
        if(!compare_pass){
            return res.status(404).json({message: 'Phone number or password is wrong!'});
            // return res.redirect("/login");
        };

        const token = sign(user.user_uid);
        
        res.status(201).json({message: "Success", token});
        // res.cookie("token") = token;
        // res.redirect("/index");
    } catch (error) {
        console.log(error.message);
        // res.redirect("/login");
    }

};

const logout = async(req, res) => {
    try {
        const { user_uid } = req.params;
        const user = await fetchOne("SELECT * FROM users WHERE user_uid=$1;", user_uid);
        if(user){
            await fetch("DELETE FROM users WHERE user_uid=$1;", user_uid);
            return res.status(200).json({message: "Deleted", user});
            // res.redirect("/register");
        }

        return res.status(404).json({message: "NOT FOUND!"});    
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    register,
    login,
    logout
};