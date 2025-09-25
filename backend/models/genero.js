const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Genero = sequelize.define(
        'Genero',
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
    );
    return Genero;
}