const users = require("../models/UserModel")
const { generateHash, compareHash } = require("../modules/bcrypt")
const { v4 } = require("uuid")
const { generateToken } = require("../modules/jwt")
const SendEmail = require("../modules/email")
const { PORT } = require("../../config")
const SignUpValidation = require("../validations/SignUpValidation")
const LoginValidation = require("../validations/LoginValidation")

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

            let hash = await generateHash(password)
            
            user = await users.create({
                user_id: v4(),
                full_name,
                username,
                email,
                password: hash,
            })

            let token = generateToken({
                ...user._doc,
                password: undefined,
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

    static async LoginPOST(req, res) {
        try {
            const { email, password } = await LoginValidation(req.body)

            let user = await users.findOne({
                email,
            })
         
            if(!user) throw new Error("User is not registered")
    
            let isPasswordTrue = await compareHash(user.password, password)
    
            if(!isPasswordTrue) throw new Error("Password incorrect")
    
            let token = generateToken({
                ...user._doc,
                password: undefined,
            })
    
            res.cookie("token", token).status(200).json({
                ok: true,
                message: "LOGGED IN",
                user,
                token,
            })
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "", 
            })
        }
    }
}