const Bcrypt = require("bcrypt")

module.exports.generateHash = async function (password) {
    let salt = await Bcrypt.genSalt(10)
    return Bcrypt.hash(password, salt)
}

module.exports.compareHash = async function (hash, password) {
    return await Bcrypt.compare(password, hash)
}