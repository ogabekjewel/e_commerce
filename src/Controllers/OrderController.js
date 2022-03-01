module.exports = class OrderController {
    static async OrderPOST(req, res) {
        try {
            
        } catch(e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            })
        }
    }
}