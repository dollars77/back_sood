module.exports =(app)=>{
    const game = require("../controllers/game.controller");

    var router = require("express").Router();
    router.post('/newGame',game.uploadimage,game.createGame)
    router.put('/updateGame',game.uploadimage,game.updateGame)
    router.put('/updateOrder',game.updateOrderGame)
    router.get('/allGame/:id',game.getAllGame)
    router.delete('/deleteGame/:id',game.deleteGame);
    router.post('/deleteimageGame',game.deleteImgGame);

    /*ของ user*/
    router.get('/allGameUser/:id',game.getAllGameUser)

    app.use("/api/game",router);
    
}