const mongoose = require("mongoose")

const ProductImageModel = new mongoose.Schema({
    product_image_id: {
        type: String,
        required: true,
        unique: true,
    },
    product_id: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
})

const product_images = mongoose.model("product_images", ProductImageModel)

module.exports = product_images