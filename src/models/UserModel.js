const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    is_verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    avatar: {
        type: String,
    },
})

const users = mongoose.model("users", UserSchema)

module.exports = users