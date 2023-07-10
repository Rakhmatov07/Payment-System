require("dotenv/config");
const {env} = process;

const config = {
    port: +env.PORT,
    jwtkey: env.secret_key
};

module.exports = config;
