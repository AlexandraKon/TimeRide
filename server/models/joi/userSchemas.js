const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports.userId = Joi.object({
    id: Joi.number().optional(),
});

module.exports.userRegisterValidation = Joi.object({
    username: Joi.string().max(50).required(),
    mail: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().optional(),
});

module.exports.userLoginValidation = Joi.object({
    username: Joi.string().max(50).required(),
    password: Joi.string().required(),
});