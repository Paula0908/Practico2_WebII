const Joi = require("joi");

const albumSchema = Joi.object({
    nombre: Joi.string().min(1).max(100).required(),
    artistaId: Joi.number().integer().required(),
});

const albumPatchSchema = Joi.object({
    nombre: Joi.string().min(1).max(100).optional(),
    artistaId: Joi.number().integer().optional(),
});

module.exports = { albumSchema, albumPatchSchema };
