const mongoose = require("mongoose")
const { MONGO_URL } = require("../../config")

require("../models/UserModel")
require("../models/CartModel")
require("../models/CategoryModel")
require("../models/CommentModel")
require("../models/OrderItemModel")
require("../models/OrderModel")
require("../models/ProductImageModel")
require("../models/ProductModel")
require("../models/ProductOptionModel")

module.exports = async function mongo() {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("CONNECTED SUCCESFULL")
    } catch(e) {
        console.log("CONNECTED FAILED" + e)
    }
}