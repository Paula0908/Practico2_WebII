const { sequelize } = require("../config/db.config");

const cancion = require("./cancion")(sequelize);
const album = require("./album")(sequelize);
const artista = require("./artista")(sequelize);
const genero = require("./genero")(sequelize);
const artista_genero = require("./artista_genero")(sequelize);


//Relaciones de 1 a N

artista.hasMany(album, { foreignKey: "artistaId", as: "albumes" });
album.belongsTo(artista, { foreignKey: "artistaId", as: "artista" });

album.hasMany(cancion, { foreignKey: "albumId", as: "canciones" });
cancion.belongsTo(album, { foreignKey: "albumId", as: "album" });

// Un artista tiene muchos géneros a través de Artista_Genero
artista.belongsToMany(genero, {through: artista_genero, foreignKey: "idArtista", otherKey: "idGenero", as: "generos",
});

// Un género pertenece a muchos artistas a través de Artista_Genero
genero.belongsToMany(artista, {through: artista_genero, foreignKey: "idGenero", otherKey: "idArtista", as: "artistas",
});

module.exports = {
    cancion,
    album,
    artista,
    genero,
    artista_genero,
    sequelize,
    Sequelize: sequelize.Sequelize
}