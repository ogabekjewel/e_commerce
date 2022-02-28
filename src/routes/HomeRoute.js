const HomeController = require("../Controllers/HomeController")
const { ProductsGET, CartAddPOST, CartPlusPATCH, CartMinusPATCH, CartGET, ProductGET, CommentPOST, CommentLikePOST, CommentDisLikePOST, CommentLikeDELETE, CommentDisLikeDELETE } = require("../Controllers/ProductController")
const AuthMiddleware = require("../middlewares/AuthMiddleware")
const router = require("express").Router()

router.get("/", HomeController)
router.get("/products/:category_id", ProductsGET)
router.post("/product/comments/:product_id", AuthMiddleware, CommentPOST)

router.get("/product/:product_slug", ProductGET)
router.get("/cart", AuthMiddleware, CartGET)

router.post("/products/cart/:product_id", AuthMiddleware, CartAddPOST)
router.patch("/products/cart/plus/:product_id", AuthMiddleware, CartPlusPATCH)
router.patch("/products/cart/minus/:product_id", AuthMiddleware, CartMinusPATCH)

router.post("/comment/like/:comment_id", AuthMiddleware, CommentLikePOST)
router.post("/comment/dislike/:comment_id", AuthMiddleware, CommentDisLikePOST)
router.delete("/comment/like/:comment_id", AuthMiddleware, CommentLikeDELETE)
router.delete("/comment/dislike/:comment_id", AuthMiddleware, CommentDisLikeDELETE)

module.exports = {
    path: "/",
    router,
}