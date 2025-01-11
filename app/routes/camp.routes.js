module.exports =(app)=>{
    const camp = require("../controllers/camp.controller");

    var router = require("express").Router();

    router.post('/newCamp',camp.uploadimage,camp.createCamp)
    router.put('/updateCamp',camp.uploadimage,camp.updateCamp)
    router.get('/allCamp',camp.getAllCamp)
    router.get('/oneCamp/:id',camp.getOneCamp)
    router.delete('/deleteCamp/:id',camp.deleteCamp);
    router.post('/deleteimagecamp',camp.deleteImgCamp)
    router.post('/deleteiconcamp',camp.deleteIconCamp)
    
    router.put('/updateOrder',camp.updateOrderCamp)




    app.use("/api/camp",router);
    
}