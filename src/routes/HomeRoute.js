const HomeController = require("../Controllers/HomeController")

const router = require("express").Router()

router.get("/", HomeController)

module.exports = {
    path: "/",
    router,
}