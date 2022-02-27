const HomeController = require("../Controllers/HomeController")
const { ProductsGET } = require("../Controllers/ProductController")

const router = require("express").Router()

router.get("/", HomeController)
router.get("/products/:category_id", ProductsGET)

module.exports = {
    path: "/",
    router,
}