const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Artista = sequelize.define(
        'Artista',
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            imagen: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            imagenUrl: {
                type: DataTypes.VIRTUAL,
                get: function () {
                    if (!this.imagen) 
                    // eslint-disable-next-line no-undef
                    return process.env.BASE_URL + '/uploads/artistas/' + 'default.png';
                    // eslint-disable-next-line no-undef
                    return process.env.BASE_URL + '/uploads/artistas/' + this.imagen
                }
            }
        },
    );
    return Artista;
}