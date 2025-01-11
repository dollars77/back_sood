module.exports =(app)=>{
    
    const history = require("../controllers/history.controller");

    var router = require("express").Router();

    router.post('/addHistory',history.EnterCamp)
    router.get('/allHistory',history.getAllHisroty)




    
    app.use("/api/history",router);
}