const Joi = require('joi');
const generoSchema = Joi.object({
    nombre: Joi.string().min(1).max(100).required()
});
module.exports = {
    generoSchema
};