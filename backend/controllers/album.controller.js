const db = require("../models");
const { generateFileName } = require("../utilities/text.utilities.js");
const { deleteFile } = require("../utilities/file.utilities.js");

exports.getAllAlbums = async (req, res) => {
    try {
        const albums = await db.album.findAll({ include: ["artista", "canciones"] });
        res.json(albums);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al listar álbumes" });
    }
};

exports.getAlbumById = async (req, res) => {
    const album = await req.obj.reload({
        include: ["artista", "canciones"] 
    });
    if (!album) return res.status(404).json({ error: "Álbum no encontrado" });
    res.json(album);
};

exports.insertAlbum = async (req, res) => {
    const { nombre, artistaId } = req.body;
    try {
        let imagenName = null;
        const fileImg = req.files?.imagen;
        if (fileImg) {
            const ext = (fileImg.name.split(".").pop() || "").toLowerCase();
            if (!["jpg", "jpeg", "png", "gif"].includes(ext)) {
            return res.status(400).json({ error: "Formato de imagen no válido. Solo se permiten jpg, jpeg, png y gif." });
            }
            imagenName = generateFileName(ext);
            // eslint-disable-next-line no-undef
            const uploadPath = __dirname + "/../public/uploads/albumes/" + imagenName;
            await fileImg.mv(uploadPath);
        }
        const nuevoAlbum = await db.album.create({
            nombre,
            artistaId,
            imagen: imagenName
        });
        res.status(201).json(nuevoAlbum);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear el álbum" });
    }
};

exports.updateAlbum = async (req, res) => {
    const { nombre, artistaId } = req.body;

    try {
        const album = req.obj;

        if (nombre) album.nombre = nombre;
        if (artistaId) album.artistaId = artistaId;

        await album.save();
        res.json(album);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al actualizar el álbum" });
    }
};

exports.deleteAlbum = async (req, res) => {
    try {
        const album = req.obj;
        await album.destroy();
        const nombreFoto = album.imagen;
        if (nombreFoto) {
            // eslint-disable-next-line no-undef
            deleteFile(__dirname + "/../public/uploads/albumes/" + nombreFoto);
        }
        res.json({ message: "Álbum eliminado correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar el álbum" });
    }
};

exports.uploadCover = async (req, res) => {
    const album = req.obj;
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
    const uploadPath = __dirname + "/../public/uploads/albumes/" + uniqueName;

    const old = album.imagen;
    await imagen.mv(uploadPath);
    album.imagen = uniqueName;
    await album.save();

    if (old) {                           
        // eslint-disable-next-line no-undef
        deleteFile(__dirname + "/../public/uploads/albumes/" + old);
    }

    res.json({
        album,
    });
};

exports.getCancionesDelAlbum = async (req, res) => {
    try {
        const canciones = await db.cancion.findAll({ where: { albumId: req.obj.id } });
        res.json(canciones);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al listar canciones del álbum' });
    }
};
