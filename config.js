require("dotenv").config()

const { env } = process

module.exports = {
    PORT: env.PORT,
    SECRET_WORD: env.SECRET_WORD,
    MONGO_URL: env.MONGO_URL,
    EMAIL: env.EMAIL,
    PASSWORD: env.PASSWORD,
} 