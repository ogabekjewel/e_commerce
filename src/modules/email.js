const Nodemailer = require("nodemailer")
const { EMAIL, PASSWORD } = require("../../config")



module.exports = async function (to, subject, text, html) {
    try {
        // I am angry :(

        const trasport = Nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: EMAIL,
                pass: PASSWORD,
            }, 
        })  
    
        return await trasport.sendMail({
            from: `"Ogabek" <ogabekmengniyozov@mail.ru> `,
            to,
            subject, 
            text,
            html
        })

    } catch (e) {
        console.log(e)
    }
}



// const nodemailer = require("nodemailer")


// const trasport =  nodemailer.createTransport({
//         host: "smtp.yandex.ru",
//         port: 465,
//         secure: true,
//         auth: {
//             user: "ogabek.mengniyozov@yandex.ru",
//             pass: "B7u@8Wo9#d",
//         },
//     },
//     {
//         from: 'Mailer Test <maia49@ethereal.email>',
//     } 
// )

// const mailer = message => {
//     trasport.sendMail(message, (err, info) => {
//         if(err) return console.log(err)
//         console.log('Email sent: ', info)
//     })
// }

// module.exports = mailer
