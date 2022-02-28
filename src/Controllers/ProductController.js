const categories = require("../models/CategoryModel")
const products = require("../models/ProductModel")
const carts = require("../models/CartModel")
const { v4 } = require("uuid")


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

    static async CartAddPOST(req, res) {
        try {
            let { product_id } = req.params

            let product = await products.find({
                product_id,
            })

            if(!product) throw new Error("Product not found")

            let cart = await carts.findOne({
                product_id,
                user_id: req.user_id,
            })

            if(cart) throw new Error("cart is already added")

            await carts.create({
                cart_id: v4(),
                caunt: 1,
                product_id,
                user_id: req.user.user_id,
            })

            res.status(201).json({
                ok: true,
                message: "Added",
            })
        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CartPlusPATCH(req, res) {
        try {
            let { product_id } = req.params

        
            let product = await products.find({
                product_id,
            })
    
            if(!product) throw new Error("Product not found")
    
            let cart = await carts.findOne({
                product_id,
                user_id: req.user.user_id,
            })
    
            if(!cart) throw new Error("cart not found")
    
            await carts.findOneAndUpdate(
                {
                    cart_id: cart.cart_id,
                },
                {
                    count: cart.count + 1,
                }
            )
    
            res.status(200).json({
                ok: true,
                message: "Plus 1"
            })
        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CartMinusPATCH(req, res) {
        try {
            let { product_id } = req.params

        
            let product = await products.find({
                product_id,
            })
    
            if(!product) throw new Error("Product not found")
    
            let cart = await carts.findOne({
                product_id,
                user_id: req.user.user_id,
            })
    
            if(!cart) throw new Error("cart not found")
    
            await carts.findOneAndUpdate(
                {
                    cart_id: cart.cart_id,
                },
                {
                    count: cart.count - 1,
                }
            )
    
            res.status(200).json({
                ok: true,
                message: "Minus 1"
            })
        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }
}



