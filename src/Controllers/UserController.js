const users = require("../models/UserModel")
const { generateHash } = require("../modules/bcrypt")
const { v4 } = require("uuid")
const { generateToken } = require("../modules/jwt")
const SendEmail = require("../modules/email")
const { PORT } = require("../../config")
const SignUpValidation = require("../validations/SignUpValidation")

module.exports = class UserController {
    static async SignUpPOST(req, res) {
        try {
            const { full_name, username, email, password } = await SignUpValidation(req.body)

            let user = await users.findOne({
                email, 
                username,
            })

            if(user) {
                throw new Error("User has already registered")
            }

            let hash = generateHash(password)

            user = await users.create({
                user_id: v4(),
                full_name,
                username,
                email,
                password: hash,
            })

            let token = generateToken({
                full_name,
                username,
                email,
            })

            let verificationEmail = await SendEmail(
                email, 
                `Verification Link`,
                "EMAIL VARIFICATION",
                `<p><a href="http://localhost:${PORT}/api/users/verify/${user._doc.user_id}">Click here</a> to activate you account</p>`
            )

            res.cookie("token",token).status(201).json({
                ok: true,
                message: "REGISTERED",
                use: user._doc,
                token,
            })

        } catch(e) {
            console.log(e)
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }

    static async VerifyEmailGET(req, res) {
        try {
            let { user_id } = req.params

            let user = await users.findOneAndUpdate(
              { user_id },
              { is_verified: true }
            );

            res.status(201).json({
                 ok: true,
                 verified: true,
                 user,
            })  
        } catch(e) {
            console.log(e)
        }
    }
}