const db = require("../models");
const { generateFileName } = require("../utilities/text.utilities.js");
const { deleteFile } = require("../utilities/file.utilities.js");

const Cancion = db.cancion;
exports.getAllCanciones = async (req, res) => {
    const canciones = await Cancion.findAll({
        include: "album"
    });
    res.json(canciones);
}
exports.getCancionById = async (req, res) => {
    const cancion = await req.obj.reload({ include: "album" });
    res.json(cancion);
}

exports.insertCancion = async (req, res) => {
    try {
        const { nombre, albumId } = req.body;

        // audio obligatorio en files.archivo
        const fileAudio = req.files?.archivo;
        if (!fileAudio) {
            return res.status(400).json({ error: "Falta archivo de audio" });
        }
        const extA = (fileAudio.name.split(".").pop() || "").toLowerCase();
        if (!["mp3", "wav", "ogg", "m4a", "flac"].includes(extA)) {
            return res.status(400).json({ error: "Formato de audio no válido" });
        }
        const audioName = generateFileName(extA);
        // eslint-disable-next-line no-undef
        const audioPath = __dirname + "/../public/uploads/canciones/" + audioName;
        await fileAudio.mv(audioPath);

        let imagenName = null;
        const fileImg = req.files?.imagen;
        if (fileImg) {
            const extI = (fileImg.name.split(".").pop() || "").toLowerCase();
            if (!["jpg", "jpeg", "png", "gif"].includes(extI)) {
                return res.status(400).json({ error: "Formato de imagen no válido" });
            }
            imagenName = generateFileName(extI);
            // eslint-disable-next-line no-undef
            const imgPath = __dirname + "/../public/uploads/canciones/" + imagenName;
            await fileImg.mv(imgPath);
        }

        const nueva = await Cancion.create({
            nombre,
            albumId,
            archivo: audioName,
            imagen: imagenName
        });

        res.status(201).json(nueva);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la canción" });
    }
};
exports.updateCancion = async (req, res) => {
    try {
        const cancion = req.obj;
        const { nombre, albumId } = req.body;

        if (nombre) cancion.nombre = nombre;
        if (albumId) cancion.albumId = albumId;

        await cancion.save();
        res.json(cancion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la canción" });
    }
}
exports.deleteCancion = async (req, res) => {
    try {
        const cancion = req.obj;
        const nombreFoto = cancion.imagen;
        const nombreArchivo = cancion.archivo;

        await cancion.destroy();

        if (nombreFoto) {
            // eslint-disable-next-line no-undef
            deleteFile(__dirname + '/../public/uploads/canciones/' + nombreFoto);
        }
        if (nombreArchivo) {
            // eslint-disable-next-line no-undef
            deleteFile(__dirname + '/../public/uploads/canciones/' + nombreArchivo);
        }
        

        res.json({ message: "Canción eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la canción" });
    }
}
exports.uploadImagen = async (req, res) => {
    const cancion = req.obj;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "No se ha proporcionado ninguna foto" });
    }
    const { imagen } = req.files;
    if (!imagen) return res.status(400).json({ error: "No se ha proporcionado ninguna foto" });

    const extension = imagen.name.split(".").pop().toLowerCase();
    if (!["jpg", "jpeg", "png", "gif"].includes(extension)) {
        return res.status(400).json({ error: "Formato de imagen no válido" });
    }

    const uniqueName = generateFileName(extension);
    // eslint-disable-next-line no-undef
    const uploadPath = __dirname + "/../public/uploads/canciones/" + uniqueName;

    const old = cancion.imagen;                 
    await imagen.mv(uploadPath);                
    cancion.imagen = uniqueName;                
    await cancion.save();

    if (old) {
        // eslint-disable-next-line no-undef
        deleteFile(__dirname + "/../public/uploads/canciones/" + old);
    }

    res.json({ cancion });
};

exports.uploadArchivo = async (req, res) => {
    const cancion = req.obj;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "No se ha proporcionado ningún archivo de audio" });
    }
    const { archivo } = req.files;
    if (!archivo) return res.status(400).json({ error: "No se ha proporcionado ningún archivo de audio" });

    const extension = (archivo.name.split(".").pop() || "").toLowerCase();
    if (!["mp3", "wav", "ogg", "m4a", "flac"].includes(extension)) {
        return res.status(400).json({ error: "Formato de audio no válido" });
    }

    const uniqueName = generateFileName(extension);
    // eslint-disable-next-line no-undef
    const uploadPath = __dirname + "/../public/uploads/canciones/" + uniqueName;

    const old = cancion.archivo;                
    await archivo.mv(uploadPath);
    cancion.archivo = uniqueName;
    await cancion.save();

    if (old) {                                  
        // eslint-disable-next-line no-undef
        deleteFile(__dirname + "/../public/uploads/canciones/" + old);
    }

    res.json({ cancion });

};
