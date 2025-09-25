const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Artista_Genero = sequelize.define(
        'Artista_Genero',
        {
            idArtista: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            idGenero: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },{
            timestamps: false,
            indexes: [{ unique: true, fields: ["idArtista", "idGenero"] }],
        }
    );
    return Artista_Genero;
}