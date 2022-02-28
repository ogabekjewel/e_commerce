const HomeController = require("../Controllers/HomeController")
const { ProductsGET, CartAddPOST, CartPlusPATCH, CartMinusPATCH, CartGET } = require("../Controllers/ProductController")
const AuthMiddleware = require("../middlewares/AuthMiddleware")
const router = require("express").Router()

router.get("/", HomeController)
router.get("/products/:category_id", ProductsGET)

router.get("/cart", AuthMiddleware, CartGET)
router.post("/products/cart/:product_id", AuthMiddleware, CartAddPOST)
router.patch("/products/cart/plus/:product_id", AuthMiddleware, CartPlusPATCH)
router.patch("/products/cart/minus/:product_id", AuthMiddleware, CartMinusPATCH)


module.exports = {
    path: "/",
    router,
}