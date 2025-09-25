const { artistaSchema, artistaPatchSchema } = require("../validators/artistaSchema.js");
const validateJson = require("../middlewares/validation.middleware.js");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware.js");
const getObjectOr404 = require("../middlewares/getObjectOr404.middleware.js");
const db = require("../models");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/artista.controller.js");

    router.get("/", controller.getAllArtistas);
    router.post("/", validateJson(artistaSchema), controller.insertArtista);
    router.patch("/:id", isJsonRequestValid, validateJson(artistaPatchSchema), getObjectOr404(db.artista), controller.updateArtista);
    router.get("/:id", getObjectOr404(db.artista), controller.getArtistaById);
    router.delete("/:id", getObjectOr404(db.artista), controller.deleteArtista);

    router.post("/:id/imagen", getObjectOr404(db.artista), controller.uploadProfilePicture);

    // relaciones entre artista y genero
    router.get("/:id/generos", getObjectOr404(db.artista), controller.getGenerosDeArtista);
    router.get('/:id/albums', getObjectOr404(db.artista), controller.getAlbumsDeArtista);
    router.post("/:id/generos", isJsonRequestValid, getObjectOr404(db.artista), controller.addGeneroAArtista);
    router.delete("/:id/generos/:generoId", getObjectOr404(db.artista), controller.removeGeneroDeArtista);
    router.put("/:id/generos", isJsonRequestValid, getObjectOr404(db.artista), controller.setGenerosDeArtista);

    app.use('/artistas', router);
};