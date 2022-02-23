const { SignUpPOST, VerifyEmailGET } = require("../Controllers/UserController")

const router = require("express").Router()

router.post("/login",)
router.post("/signup", SignUpPOST)
router.get("/verify/:user_id", VerifyEmailGET)

module.exports = {
    path: "/users",
    router,
}