const mongoose = require("mongoose")

const ProductOptionModel = new mongoose.Schema({
    product_option_id: {
        type: String,
        required: true,
        unique: true,
    },
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    },
})

const product_options = mongoose.model("product_options", ProductOptionModel)

module.exports = product_options