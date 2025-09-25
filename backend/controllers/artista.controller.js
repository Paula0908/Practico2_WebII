const db = require("../models");
const { generateFileName } = require("../utilities/text.utilities.js");
const { deleteFile } = require("../utilities/file.utilities.js");
exports.getAllArtistas = async (req, res) => {
    try {
        const artistas = await db.artista.findAll({
            include: [
                { association: 'generos', through: { attributes: [] } }
            ]
        });
        res.json(artistas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al listar artistas" });
    }
}

exports.getArtistaById = async (req, res) => {
    const artista = await req.obj.reload({
        include: [
            { association: 'generos', through: { attributes: [] } }
        ]
    });
    res.json(artista);
};

exports.insertArtista = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        let imagenName = null;
        const fileImg = req.files?.imagen;
        if (fileImg) {
            const ext = (fileImg.name.split(".").pop() || "").toLowerCase();
            if (!["jpg", "jpeg", "png", "gif"].includes(ext)) {
            return res.status(400).json({ error: "Formato de imagen no válido. Solo se permiten jpg, jpeg, png y gif." });
            }
            imagenName = generateFileName(ext);
            // eslint-disable-next-line no-undef
            const uploadPath = __dirname + "/../public/uploads/artistas/" + imagenName;
            await fileImg.mv(uploadPath);
        }

        const nuevoArtista = await db.artista.create({
            nombre,
            descripcion,
            imagen: imagenName,
        });

        res.status(201).json(nuevoArtista);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear el artista" });
    }
}

exports.updateArtista = async (req, res) => {
    const { nombre, descripcion } = req.body;

    try {
        const artista = req.obj;

        if (nombre) artista.nombre = nombre;
        if (descripcion) artista.descripcion = descripcion;

        await artista.save();
        res.json(artista);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al actualizar el artista" });
    }
}

exports.deleteArtista = async (req, res) => {
    try {
        const artista = req.obj;
        await artista.destroy();
        const nombreFoto = artista.imagen;
        if (nombreFoto) {
            // eslint-disable-next-line no-undef
            deleteFile(__dirname + '/../public/uploads/artistas/' + nombreFoto);
        }
        res.json({ message: 'Artista eliminado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar el artista" });
    }
}

exports.uploadProfilePicture = async (req, res) => {
    const artista = req.obj;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "No se ha proporcionado ninguna foto" });
    }
    const { imagen } = req.files;
    if (!imagen) {
        return res.status(400).json({ error: "No se ha proporcionado ninguna foto" });
    }

    const extension = (imagen.name.split(".").pop() || "").toLowerCase();
    if (!["jpg", "jpeg", "png", "gif"].includes(extension)) {
        return res.status(400).json({ error: "Formato de imagen no válido. Solo se permiten jpg, jpeg, png y gif." });
    }

    const uniqueName = generateFileName(extension);
    // eslint-disable-next-line no-undef
    const uploadPath = __dirname + "/../public/uploads/artistas/" + uniqueName;

    const old = artista.imagen;          
    await imagen.mv(uploadPath);         
    artista.imagen = uniqueName;         
    await artista.save();

    if (old) {                           
        // eslint-disable-next-line no-undef
        deleteFile(__dirname + "/../public/uploads/artistas/" + old);
    }

    res.json({ artista });
};

// GET /artistas/:id/generos
exports.getGenerosDeArtista = async (req, res) => {
    const generos = await req.obj.getGeneros(); // req.obj es el Artista
    res.json(generos);
}

// POST /artistas/:id/generos  { generoId }
exports.addGeneroAArtista = async (req, res) => {
    const { generoId } = req.body;
    const genero = await db.genero.findByPk(generoId);
    if (!genero) return res.status(404).json({ error: "Género no encontrado" });

    await req.obj.addGenero(genero); // usa la tabla intermedia Artista_Genero
    res.status(201).json({ message: "Género agregado al artista" });
}

// DELETE /artistas/:id/generos/:generoId
exports.removeGeneroDeArtista = async (req, res) => {
    const { generoId } = req.params;
    await req.obj.removeGenero(generoId); // acepta id directo
    res.json({ message: "Género removido del artista" });
}

// PUT /artistas/:id/generos  { ids: number[] }  (reemplaza todos)
exports.setGenerosDeArtista = async (req, res) => {
    const { ids } = req.body; // ej: [1,3,5]
    await req.obj.setGeneros(ids || []);
    const generos = await req.obj.getGeneros();
    res.json(generos);
}

exports.getAlbumsDeArtista = async (req, res) => {
    try {
        const albums = await db.album.findAll({ where: { artistaId: req.obj.id } });
        res.json(albums);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al listar álbumes del artista' });
    }
};

