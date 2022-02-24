const Joi = require("joi")

module.exports = function (data) {
    return Joi.object({
        product_name: Joi.string().required(),
        price: Joi.number().required(),
        desciption: Joi.number().min(4).required(),
    }).validateAsync(data)
}