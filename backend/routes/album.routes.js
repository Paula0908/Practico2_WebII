const { albumSchema, albumPatchSchema } = require("../validators/albumSchema.js");
const validateJson = require("../middlewares/validation.middleware.js");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware.js");
const getObjectOr404 = require("../middlewares/getObjectOr404.middleware.js");
const db = require("../models");

module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/album.controller.js");

    router.get("/", controller.getAllAlbums);
    router.post("/", validateJson(albumSchema), controller.insertAlbum);
    router.patch("/:id", isJsonRequestValid, validateJson(albumPatchSchema), getObjectOr404(db.album), controller.updateAlbum);
    router.get("/:id", getObjectOr404(db.album), controller.getAlbumById);
    router.delete("/:id", getObjectOr404(db.album), controller.deleteAlbum);

    router.post("/:id/imagen", getObjectOr404(db.album), controller.uploadCover);
    router.get('/:id/canciones', getObjectOr404(db.album), controller.getCancionesDelAlbum);

    app.use("/albums", router);
};
