const { SignUpPOST, VerifyEmailGET, LoginPOST } = require("../Controllers/UserController")

const router = require("express").Router()

router.post("/login", LoginPOST)
router.post("/signup", SignUpPOST)
router.get("/verify/:user_id", VerifyEmailGET)

module.exports = {
    path: "/users",
    router,
}