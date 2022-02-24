const users = require("../models/UserModel")
const categories = require("../models/CategoryModel")
const products = require("../models/ProductModel")
const CategoryValidation = require("../validations/CategoryValidation")
const ProductPOSTValidation = require("../validations/ProductPOSTValidation")
const slugify = require("slugify")
const { v4 } = require("uuid")


module.exports = class AdminController{
    static async UsersGET(req, res) {
        try {
            let customers = await users.find()

            res.status(200).json({
                ok: true,
                users: customers,
            })

        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CreateAdminPATCH(req, res) {
        try {
            const { user_id } = req.params

            let user = await users.findOneAndUpdate(
                { user_id },
                { role: "admin" },
            )

            res.status(200).json({
                ok: true,
                message: "succes",
                user,
            })

        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async UserDELETE(req, res) {
        try {
            const { user_id } = req.params

            let user = await users.findOne({
                user_id,
            })

            if(!user) throw new Error("User not found")
            
            if(user.role === "superadmin") {
                res.status(403).json({
                    ok: false,
                    message: "Permission dained"
                })
                return
            }

            await users.deleteOne({
                user_id,
            })

            res.status(201).json({
                ok: true,
                message: "User deleted",
            })

        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CategoriesGET(req, res) {
        try {
            let { c_page, p_page } = req.query

            c_page = c_page || 1
            p_page = p_page || 3

            let categoryList = await categories.find().skip(p_page * (c_page - 1)).limit(p_page)

            res.status(200).json({
                ok: true,
                categories:categoryList,
            })

        } catch(e) {
            res.status(401).json({
                ok: false,
                message: e + "",
            })
        }
    }
    
    static async CategoriesPOST(req, res) {
        try{
            let { category_name } = await CategoryValidation(req.body)
            
            let category = await categories.findOne({
                category_name,
            })

            if(category) throw new Error("Category has already been added")

            category = await categories.create({
                category_id: v4(),
                category_name: category_name,
            })

            res.status(200).json({
                ok: true,
                message: "Categories created",
                category,
            })

        } catch(e) {
            console.log(e)
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CategoriesPATCH(req, res) {
        try{
            let { category_name } = await CategoryValidation(req.body)
            
          
            let category = await categories.findOne({
                category_id: req.params.category_id,
            })
            
            if(!category) throw new Error("Category not found")

            category = await categories.findOneAndUpdate(
                { category_id: req.params.category_id },
                { category_name }
            )
            
            res.status(200).json({
                ok: true,
                message: "Categories update",
            })

        } catch(e) {
            console.log(e)
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CategoriesDELETE(req, res) {
        try{
            let { category_id } = req.params

            await categories.deleteOne({
                category_id,
            })

            res.status(200).json({
                ok: true,
                message: "DELETED",
            })
        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }

    }

    static async ProductsGET(req, res) {
        try{
            let { c_page, p_page } = req.query

            c_page = c_page || 1
            p_page = p_page || 10

            let ProductItems = await products.find().skip(p_page * (c_page - 1)).limit(p_page)

            res.status(200).json({
                ok: true,
                ProductItems,
            })
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async ProductPOST(req, res) {
        try{
            const { category_id } = req.params
            const { product_name, price, description } = await ProductPOSTValidation(req.body)

            let slug = slugify(product_name.toLowerCase())

            let product = await products.findOne({
                slug, 
                category_id,
            })

            if(product) throw new Error(`Product slug ${slug} already exsists`)

            let category = await categories.findOne({
                category_id,
            })

            if(!category) throw new Error("Category not found")

            product = await products.create({
                product_id: v4(),
                product_name,
                product_slug: slug,
                category_id,
                description,
                price,
            })

            res.status(200).json({
                ok: true,
                message: "Product added",
                product,
            })

        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }
}