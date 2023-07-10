const { fetchOne, fetch } = require("../../libs/pg");

const addCard = async(req, res) => {
    try {
        const { card_number, type_of_card, issue_date, balance, user_uid } = req.body;
        console.log(card_number);
        const card = await fetchOne("SELECT * FROM cards WHERE card_number=$1;", card_number);
        if(card){
            return res.status(409).json({message: 'Invalid Card Number!'});
            // return res.redirect("/index");
        };
        
        // const {user_uid} = req.user;
        const newCard = await fetchOne("INSERT INTO cards(card_number, type_of_card, issue_date, balance, user_uid) VALUES($1, $2, $3, $4, $5) RETURNING*;", card_number, type_of_card, issue_date, balance, user_uid);

        return res.status(201).json({message: "Created", newCard});
        // res.redirect("/index");
    } catch (error) {
        console.log(error.message);
        // res.redirect("/index")
    }
};

const deleteCard = async(req, res) => {
    try {
        const { card_uid } = req.params;
        const card = await fetchOne("SELECT * FROM cards WHERE card_uid=$1;", card_uid);
        if(card){
            await fetch("DELETE FROM cards WHERE card_uid=$1;", card_uid);
            return res.status(200).json({message: "Deleted", card});
            // res.redirect("/index");
        }

        return res.status(404).json({message: "NOT FOUND!"});    
    } catch (error) {
        console.log(error.message);
    }
};



module.exports = {
    addCard,
    deleteCard
};
