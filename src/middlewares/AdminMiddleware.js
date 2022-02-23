const { checkToken } = require("../modules/jwt")

module.exports = async function (req, res, next) {
    let token = req?.cookies?.token || req.headers["authorization"] 
    // req.cookies bo'lmasa undefined ichidan tokenni qidiradi va error beradi ? qo'ysak cookies bo'lmasa req?.cookies?.token o'zini undefined oladi

    token = checkToken(token)

    if(!token) {
        res.redirect('/users/login')
        return
    }

    if(token.role === "user") {
        res.redirect("/")
        return
    }

    req.admin = token

    next()
}