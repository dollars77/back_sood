module.exports =(app)=>{
    
    const preset = require("../controllers/preset.controller");

    var router = require("express").Router();

    router.post('/addPreset',preset.createPreset)
    router.put('/updatePreset/:id',preset.UpdatePreset)
    router.get('/allgame',preset.getAllGame)
    router.get('/allPreset',preset.getAllPreset)
    router.get('/OnePreset/:id',preset.getOnePreset)
    router.put('/selectPreset/:id',preset.SelectPreset)
    router.delete('/deletePreset/:id',preset.deletePreset);

    router.get('/OnePresetUser',preset.getOnePresetUser)




    
    app.use("/api/preset",router);
}