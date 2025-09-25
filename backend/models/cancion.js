const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Cancion = sequelize.define(
        'Cancion',
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            albumId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            archivo: {
                type: DataTypes.STRING,
                allowNull: false,
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
                    return process.env.BASE_URL + '/uploads/canciones/' + 'default.png';
                    // eslint-disable-next-line no-undef
                    return process.env.BASE_URL + '/uploads/canciones/' + this.imagen
                }
            },
            archivoUrl: {
                type: DataTypes.VIRTUAL,
                get: function () {
                    if (!this.archivo) 
                    return null
                    // eslint-disable-next-line no-undef
                    return process.env.BASE_URL + '/uploads/canciones/' + this.archivo
                }
            }
        },
    );
    return Cancion;
}