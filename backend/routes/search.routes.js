module.exports = (app) => {
  const router = require("express").Router();
  const controller = require("../controllers/search.controller.js");

  router.get("/", controller.search);

  app.use("/search", router);
};
