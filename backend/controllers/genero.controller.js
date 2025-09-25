const db = require("../models");
const { capitalizeWords } = require("../utilities/text.utilities");
const Genero = db.genero;
exports.getAllGeneros = async (req, res) => {
    const generos = await Genero.findAll();
    res.json(generos);
}
exports.getGeneroById = async (req, res) => {
    const genero = req.obj;
    res.json(genero);
}

exports.insertGenero = async (req, res) => {
    try {
        let { nombre } = req.body;
        nombre = capitalizeWords(nombre);

        const yaExiste = await Genero.findOne({ where: { nombre } });
        if (yaExiste) {
        return res.status(409).json({ error: 'El género ya existe' });
        }

        const nuevoGenero = await Genero.create({ nombre });
        res.status(201).json(nuevoGenero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el género' });
    }
}
exports.updateGenero = async (req, res) => {
    try {
        const genero = req.obj;
        let { nombre } = req.body;
        nombre = capitalizeWords(nombre);

        const duplicado = await Genero.findOne({ where: { nombre } });
        if (duplicado && duplicado.id !== genero.id) {
        return res.status(409).json({ error: 'El género ya existe' });
        }

        genero.nombre = nombre;
        await genero.save();
        res.json(genero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el género' });
    }
};
exports.deleteGenero = async (req, res) => {
    try{
        const genero = req.obj;
        await genero.destroy();
        res.json({ message: 'Género eliminado correctamente' });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el género' });
    }
}

exports.getArtistasDeGenero = async (req, res) => {
    const genero = req.obj; 
    const artistas = await genero.getArtistas({ include: ["albumes"] }); 
    res.json(artistas);
}