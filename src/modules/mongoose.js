const mongoose = require("mongoose")
const { MONGO_URL } = require("../../config")

module.exports = async function mongo() {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("CONNECTED SUCCESFULL")
    } catch(e) {
        console.log("CONNECTED FAILED" + e)
    }
}