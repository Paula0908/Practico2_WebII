const db = require("../models");
const { Op, fn, col, where } = require("sequelize");

function nameFilter(q) {
  // LOWER(nombre) LIKE %q%
    return where(fn("LOWER", col("nombre")), { [Op.like]: `%${q.toLowerCase()}%` });
}

exports.search = async (req, res) => {
    try {
        const q = (req.query.q || "").trim();
        if (!q) return res.status(400).json({ error: "Parámetro 'q' requerido" });

        let limit = parseInt(req.query.limit || "10", 10);
        if (isNaN(limit) || limit <= 0) limit = 10;
        limit = Math.min(limit, 50);

    const [artistas, generos, albums, canciones] = await Promise.all([
        db.artista.findAll({
            where: nameFilter(q),
            order: [["nombre", "ASC"]],
            limit,
            attributes: ["id", "nombre", "imagen","imagenUrl"],
        }),
        db.genero.findAll({
            where: nameFilter(q),
            order: [["nombre", "ASC"]],
            limit,
            attributes: ["id", "nombre"],
        }),
        db.album.findAll({
            where: nameFilter(q),
            order: [["nombre", "ASC"]],
            limit,
            attributes: ["id", "nombre", "imagen", "imagenUrl", "artistaId"],
        }),
        db.cancion.findAll({
            where: nameFilter(q),
            order: [["nombre", "ASC"]],
            limit,
            attributes: ["id", "nombre", "imagen","imagenUrl", "albumId"],
        }),
    ]);

        res.json({
            q,
            limit,
            resultados: { artistas, generos, albums, canciones },
        });
    } catch (err) {
        console.error("Error en /search:", err);
        res.status(500).json({ error: "Error realizando la búsqueda" });
    }
};
