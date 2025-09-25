module.exports = app => {
    require("./search.routes")(app);
    require('./album.routes')(app);
    require('./artista.routes')(app);
    require('./cancion.routes')(app);
    require('./genero.routes')(app);

};