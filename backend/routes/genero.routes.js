const { generoSchema } = require("../validators/generoSchema.js");
const validateJson = require("../middlewares/validation.middleware.js");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware.js");
const getObjectOr404 = require("../middlewares/getObjectOr404.middleware.js");
const db = require("../models");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/genero.controller.js");

    router.get("/", controller.getAllGeneros);
    router.post("/", isJsonRequestValid, validateJson(generoSchema), controller.insertGenero);
    router.put("/:id", isJsonRequestValid, validateJson(generoSchema), getObjectOr404(db.genero), controller.updateGenero);
    router.get("/:id", getObjectOr404(db.genero), controller.getGeneroById);
    router.delete("/:id", getObjectOr404(db.genero), controller.deleteGenero);
    
    router.get("/:id/artistas", getObjectOr404(db.genero), controller.getArtistasDeGenero);
    
    app.use('/generos', router);
};