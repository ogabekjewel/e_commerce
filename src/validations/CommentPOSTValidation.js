const Joi = require("joi")

module.exports = function (data) {
    return Joi.object({
        star: Joi.number().min(1).max(5).required(),
        text: Joi.string().min(5).required(),
    }).validateAsync(data)
}