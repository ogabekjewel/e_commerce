const { UsersGET, CreateAdminPATCH, UserDELETE, CategoriesGET } = require("../Controllers/AdminController")
const AdminMiddleware = require("../middlewares/AdminMiddleware")
const router = require("express").Router()

router.get("/users", AdminMiddleware, UsersGET)
router.patch("/users/make-admin/:user_id", AdminMiddleware, CreateAdminPATCH)
router.delete("/users/delete/:user_id", AdminMiddleware, UserDELETE)

router.get("/categories", AdminMiddleware, CategoriesGET)

module.exports = {
    path: "/admin",
    router,
}

/*

    users - GET
    user - DELETE

    categories - GET
    products - GET

    category - GET POST PATCH DELETE
    product - GET POST PATCH DELETE

 */
