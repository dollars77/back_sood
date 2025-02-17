module.exports = (app) => {
    const admin = require("../controllers/admin.controller");

    var router = require("express").Router();

    router.get('/allAdmin', admin.getAllAdmin)
    router.get('/oneAdmin/:id', admin.getOneAdmin)
    router.put('/updateAdmin/:id', admin.updateAdmin)
    router.delete('/deleteAdmin/:id', admin.deleteAdmin)

    router.post('/generate-hmac', admin.genHMAC)

    router.post('/webhook', admin.truewalletgetlist)

    app.use("/api/admin", router);
}