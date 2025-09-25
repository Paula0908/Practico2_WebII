const Joi = require('joi');
const cancionSchema = Joi.object({
    nombre: Joi.string().min(1).max(100).required(),
    albumId: Joi.number().integer().required()
});
const cancionPatchSchema = Joi.object({
    nombre: Joi.string().min(1).max(100).optional(),
    albumId: Joi.number().integer().optional()
});

module.exports = {
    cancionSchema,
    cancionPatchSchema
};