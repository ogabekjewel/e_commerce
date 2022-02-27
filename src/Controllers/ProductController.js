const categories = require("../models/CategoryModel")
const products = require("../models/ProductModel")

module.exports = class ProductCntroller {
    static async ProductsGET(req, res) {
        try {
            let { category_id } = req.params
            let { c_page, p_page } = req.query

            c_page = c_page || 1
            p_page = p_page || 24

            let category = await categories.find({
                category_id,
            })

            if(!category) throw new Error("Category not found")

            let productList = await products.find({
                category_id,
            }).skip(p_page * (c_page-1)).limit(p_page)

            
            let recProducts = await products.find({
                is_rec: true,
            })
            let bestSellers = await products.find({
                is_best: true,
            })

            let randomRec = []

            while (randomRec.length < 13 && recProducts.length > 0) {
                let randomNumber = Math.round(Math.random() * recProducts.length - 1)
                let product = recProducts.pop(randomNumber)
                randomRec.push(product)
            }
            
            let randomBest = []

            while (randomBest.length < 13 && bestSellers.length > 0) {
                let randomNumber = Math.round(Math.random() * bestSellers.length - 1)
                let product = bestSellers.pop(randomNumber)
                randomBest.push(product)
            }

            let categoryList = await categories.find()

            res.status(200).json({
                ok: true,
                categories: categoryList,
                rec: randomRec,
                best: randomBest
            })


        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + ""
            })
        }
    }
}