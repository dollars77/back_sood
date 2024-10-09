module.exports =(app)=>{
    const banner = require("../controllers/banner.controller");

    var router = require("express").Router();

    router.post('/newBannerHeader',banner.uploadimage,banner.createBannerheader)

    router.post('/deleteimageBanner',banner.deleteImgBanner)
    router.delete('/deleteBanner/:id',banner.deleteBanner);
    router.get('/allBanner',banner.getAllBanner)
    router.get('/allBanner/:type',banner.getAllBannerByType)
    router.get('/allBanner/:type/:language',banner.getAllBannerByTypeAndLanguage)

    router.put('/updateOrder',banner.updateOrderBanner)



    app.use("/api/banner",router);
    
}