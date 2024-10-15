module.exports =(app)=>{
    const timerestriction = require("../controllers/timerestriction.controller");

    var router = require("express").Router();
    router.post('/checkTime',timerestriction.createTimebyCamp)
    router.post('/enterCamp',timerestriction.EnterCamp)


    app.use("/api/timerestriction",router);
    
}