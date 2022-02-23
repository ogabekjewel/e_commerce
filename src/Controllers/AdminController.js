const users = require("../models/UserModel")
const categories = require("../models/CategoryModel")
const CategoryValidation = require("../validations/CategoryValidation")
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

            let categoryList = await categories.find({
                limit: p_page,
                offset: p_page * (c_page - 1)
            })

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
}