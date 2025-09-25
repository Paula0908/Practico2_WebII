const { cancionSchema, cancionPatchSchema  } = require("../validators/cancionSchema.js");
const validateJson = require("../middlewares/validation.middleware.js");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware.js");
const getObjectOr404 = require("../middlewares/getObjectOr404.middleware.js");
const db = require("../models");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/cancion.controller.js");

    router.get("/", controller.getAllCanciones);
    router.post("/", validateJson(cancionSchema), controller.insertCancion);
    router.patch("/:id", isJsonRequestValid, validateJson(cancionPatchSchema), getObjectOr404(db.cancion), controller.updateCancion);
    router.get("/:id", getObjectOr404(db.cancion), controller.getCancionById);
    router.delete("/:id", getObjectOr404(db.cancion), controller.deleteCancion);

    router.post("/:id/imagen", getObjectOr404(db.cancion), controller.uploadImagen);
    router.post("/:id/archivo", getObjectOr404(db.cancion), controller.uploadArchivo);

    app.use('/canciones', router);
};