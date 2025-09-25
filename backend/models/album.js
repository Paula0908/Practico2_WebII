const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Album = sequelize.define(
        'Album',
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            artistaId: {
                type: DataTypes.INTEGER,
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
                    return process.env.BASE_URL + '/uploads/albumes/' + 'default.png';
                    // eslint-disable-next-line no-undef
                    return process.env.BASE_URL + '/uploads/albumes/' + this.imagen
                }
            }
        },
    );
    return Album;
}