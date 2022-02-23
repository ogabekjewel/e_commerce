const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    comment_id: {
        type: String,
        required: true,
        unique: true,
    },
    text: {
        type: String,
        required: true,
    },
    star: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    user_id: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    },
})

const comments = mongoose.model("comments", CommentSchema)

module.exports = comments