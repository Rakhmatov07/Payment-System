const { fetchOne, fetch } = require("../../libs/pg");

const payment = async(req, res) => {
    try {
        // 2% for payment 1% cashback 1% for application balance
        const { sender_card, reciever_id, amount } = req.body;
        const card = await fetchOne("SELECT * FROM cards WHERE card_number=$1;", sender_card);
        const reciever = await fetchOne("SELECT * FROM stores WHERE store_uid=$1;", reciever_id);
        if(!card) return res.status(404).json({message: "Card is Not Found"});
        if(!reciever) return res.status(404).json({message: "Reciever is Not Found"});
     
        await fetchOne("BEGIN TRANSACTION");
        await fetchOne("UPDATE cards SET balance = balance - $1 WHERE card_number=$2;", amount*1.02, sender_card);
        const {balance} = await fetchOne("SELECT * FROM cards WHERE card_number=$1;", sender_card);

        if(balance < 0) {
            await fetchOne("ROLLBACK");
            return res.status(400).json({message: "Insufficient funds"});
        }    
        await fetchOne("UPDATE stores SET balance = balance + $1 WHERE store_uid=$2;", amount, reciever_id);
        await fetchOne("UPDATE app SET balance = balance + $1;", amount * 0.01);
    
        const cashback_card = await fetchOne("SELECT cc.cashback_card_uid, cc.balance FROM cashback_cards cc JOIN users USING(user_uid) WHERE user_uid=$1;", card.user_uid);
        await fetchOne("UPDATE cashback_cards SET balance = balance + $1 WHERE cashback_card_uid=$2;", amount*0.01, cashback_card.cashback_card_uid);
        
        await fetchOne("COMMIT");
        await fetchOne("INSERT INTO histories(user_uid, sender, reciever, amount) VALUES($1, $2, $3, $4);", card.user_uid, sender_card, reciever_id, amount*1.02);

        // console.log(await fetch("select * from stores;"));
        // console.log(await fetch("select * from cashback_cards;"));
        // console.log(await fetch("select * from cards;"));
        // console.log(await fetch("select * from app;")); 
        
        res.status(200).json({message: "Success"});
    } catch (error) {
        console.log(error);
        await fetch("ROLLBACK");
        res.status(501).json({message: "Failed"});
    }
};

const transfer = async(req, res) => {
    try {
        // 1% for application balance
        const { sender_card, reciever_card, amount } = req.body;
        const s_card = await fetchOne("SELECT * FROM cards WHERE card_number=$1;", sender_card);
        const r_card = await fetchOne("SELECT * FROM cards WHERE card_number=$1;", reciever_card);
        if(!s_card) return res.status(404).json({message: " Sender's Card is Not Found"});
        if(!r_card) return res.status(404).json({message: "Reciever's Card is Not Found"});
     
        await fetchOne("BEGIN TRANSACTION");
        await fetchOne("UPDATE cards SET balance = balance - $1 WHERE card_number=$2;", amount*1.01, sender_card);
        const {balance} = await fetchOne("SELECT * FROM cards WHERE card_number=$1;", sender_card);
        
        if(balance < 0) {
            await fetchOne("ROLLBACK");
            return res.status(400).json({message: "Insufficient funds"});
        }    
        await fetchOne("UPDATE cards SET balance = balance + $1 WHERE card_number=$2;", amount, reciever_card);
        await fetchOne("UPDATE app SET balance = balance + $1;", amount * 0.01);
            
        await fetchOne("COMMIT");
        await fetchOne("INSERT INTO histories(user_uid, sender, reciever, amount) VALUES($1, $2, $3, $4);", s_card.user_uid, sender_card, reciever_card, amount*1.01);
        
        // console.log(await fetch("select * from cards;"));
        // console.log(await fetch("select * from app;")); 
        
        res.status(200).json({message: "Success"});
    } catch (error) {
        console.log(error);
        await fetch("ROLLBACK");
        res.status(501).json({message: "Failed"});
    }

};

module.exports = {
    payment,
    transfer
};