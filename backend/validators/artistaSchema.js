const Joi = require('joi');
const artistaSchema = Joi.object({
    nombre: Joi.string().min(1).max(100).required(),
    descripcion: Joi.string().min(1).max(255).optional().allow(null, ''),
});

const artistaPatchSchema = Joi.object({
    nombre: Joi.string().min(1).max(100).optional(),
    descripcion: Joi.string().min(1).max(255).optional().allow(null, ''),
});


module.exports = {
    artistaSchema,
    artistaPatchSchema
};