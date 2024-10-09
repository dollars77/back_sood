module.exports =(app)=>{
    const timerestriction = require("../controllers/timerestriction.controller");

    var router = require("express").Router();
    router.post('/checkTime',timerestriction.createTimebyCamp)


    app.use("/api/timerestriction",router);
    
}