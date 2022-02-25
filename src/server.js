const Express = require("express")
const CookieParser = require("cookie-parser")
const Fs = require("fs")
const Path = require("path")
const Morgan = require("morgan")
const { PORT } = require("../config")
const mongo = require("./modules/mongoose")
const ExpressFileUpload = require("express-fileupload")

const app = Express()

async function server() {
    app.use(CookieParser())
    app.use(Morgan("tiny"))
    app.use("/public", Express.static(Path.join(__dirname, "public")))
    app.use(ExpressFileUpload())
    app.use(Express.json())
    app.use(Express.urlencoded({ extended: true}))

    Fs.readdir(Path.join(__dirname, "routes"), (err, files) => {
    if(!err) {
        files.forEach(file => {
            const RoutePath = Path.join(__dirname, "routes", file)
            const Route = require(RoutePath)
            if(Route.path && Route.router) app.use(`/api${Route.path}`, Route.router)
        })
    } 
    })
    await mongo()
}

server()

app.listen(PORT, _=> console.log(`SERVER READY AT PORT ${PORT}`))