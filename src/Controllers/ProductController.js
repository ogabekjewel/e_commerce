const categories = require("../models/CategoryModel")
const products = require("../models/ProductModel")
const carts = require("../models/CartModel")
const product_options = require("../models/ProductOptionModel")
const product_images = require("../models/ProductImageModel")
const comments = require("../models/CommentModel")
const { v4 } = require("uuid")
const { checkToken } = require("../modules/jwt")
const CommentPOSTValidation = require("../validations/CommentPOSTValidation")
const path = require("path")
const comment_images = require("../models/CommentImageModel")
const comment_likes = require("../models/CommentLikeModel")
const comment_dislikes = require("../models/CommentDislike")

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

    static async CartGET(req, res) {
        try {
            let cart = await carts.findOne({
                user_id: req.user.user_id,
            })

            res.status(200).json({
                ok: true,
                cart,
            })
        } catch(e) {
            res.status(200).json({
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
    
            if(cart.count == 1) {
                await carts.deleteOne({
                    cart_id: cart.cart_id
                })
            } else {
                await carts.findOneAndUpdate(
                    {
                        cart_id: cart.cart_id,
                    },
                    {
                        count: cart.count - 1,
                    }
                )
            }
    
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

    static async ProductGET(req, res) {
        try {
            let { product_slug } = req.params

            let product = await products.findOne({
                product_slug,
            })
    
            if(!product) throw new Error("Product not found")
    
            let productOptions = await product_options.find({
                product_id: product.product_id,
            })
    
            let productImages = await product_images.find({
                product_id: product.product_id,
            })
    
            let productCommets = await comments.find({
                product_id: product.product_id,
            })
            let token = req?.cookies?.token || req.headers["authorization"] 
            
            token = checkToken(token)
            if(token) {
                req.user = token
            }

            let cart

            if(req.user) {
                let cart = await carts.findOne({
                   user_id: req.user.user_id,
                })
            }
            
    
            res.status(200).json({
                ok: true,
                product,
                product_options: productOptions,
                product_images: productImages,
                comments: productCommets,
                cart: cart,
            })
    
        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CommentPOST(req, res) {
        try {
            let { product_id } = req.params
            let { star, text } = await CommentPOSTValidation(req.body)

            let product = await products.findOne({
                product_id,
            })

            if(!product) throw new Error("Product not found")

            let comment = await comments.create({
                comment_id: v4(),
                text,
                star,
                user_id: req.user.user_id,
                product_id,
            })
            
            let files = req.files.image
            if(files) {
                for(let file of files) {
                    let fileType = file.mimetype.split("/")[0]
                    let fileFormat = file.mimetype.split("/")[1]

                    if(fileType !== "image" && fileType !== "vector") {
                        throw new Error("File type is must be 'image' or 'vector'")
                    }

                    let fileName = `${file.md5}.${fileFormat}`
                    let filePath = path.join(__dirname, '..', 'public', 'comment_images', fileName)
                    await file.mv(filePath)

                    let comment_image = await comment_images.create({
                        comment_id: comment._doc.comment_id,
                        image: fileName,
                        comment_image_id: v4(),
                    }) 
                }
            }

            let commentImages = await comment_images.find({
                comment_id: comment._doc.comment_id, 
            })


            res.status(201).json({
                ok: true,
                message: "Created",
                comment,
                commentImages,
            })
        } catch(e) {
            res.status(400).json({
                ok: false,
                mes: e + "",
            })
        }
    }

    static async CommentLikePOST(req, res) {
        try {
            const { comment_id } = req.params
            
            let comment = await comments({
                comment_id,
            })

            if(!comment) throw new Error("Comment not found")

            let like = await comment_likes.findOne({
                user_id: req.user.user_id,
                comment_id: comment.comment_id,
            })

            if(like) throw new Error("Like already added")

            await comment_dislikes.deleteOne({
                user_id: req.user.user_id,
                comment_id: comment.comment_id,
            })

            await comment_likes.create({
                like_id: v4(),
                user_id: req.user.user_id,
                comment_id: comment.comment_id,
            })

            res.status(201).json({
                ok: true,
                message: "like",
            })

        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CommentLikeDELETE(req, res) {
        try {
            const { comment_id } = req.params
            
            let comment = await comments({
                comment_id,
            })

            if(!comment) throw new Error("Comment not found")

            await comment_likes.deleteOne({
                user_id: req.user.user_id,
                comment_id: comment.comment_id,
            })

            res.status(200).json({
                ok: true,
                message: "like canceled",
            })

        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CommentDisLikePOST(req, res) {
        try {
            const { comment_id } = req.params
            
            let comment = await comments({
                comment_id,
            })

            if(!comment) throw new Error("Comment not found")

            let dislike = await comment_dislikes.findOne({
                user_id: req.user.user_id,
                comment_id: comment.comment_id,
            })

            if(dislike) throw new Error("Like already added")

            await comment_likes.deleteOne({
                user_id: req.user.user_id,
                comment_id: comment.comment_id,
            })

            await comment_dislikes.create({
                user_id: req.user.user_id,
                comment_id: comment.comment_id,
                dislike_id: v4(),
            })

            res.status(201).json({
                ok: true,
                message: "dislike",
            })

        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async CommentDisLikeDELETE(req, res) {
        try {
            const { comment_id } = req.params
            
            let comment = await comments({
                comment_id,
            })

            if(!comment) throw new Error("Comment not found")

            await comment_dislikes.deleteOne({
                user_id: req.user.user_id,
                comment_id: comment.comment_id,
            })

            res.status(200).json({
                ok: true,
                message: "dislike canceled",
            })

        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }
}



