const { hash, compare } = require("bcrypt");

const hash_item = async(item) => await hash(item, 15);
const compare_item = async(item, hashed_item) => await compare(item, hashed_item);

module.exports = {
    hash_item,
    compare_item
};


