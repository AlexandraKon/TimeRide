const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports.routeId = Joi.object({
    id: Joi.objectId().required(),
});

module.exports.routesPagination = Joi.object({
    skip: Joi.number().integer(),
    limit: Joi.number().integer(),
}).and('skip', 'limit');

const locationSchema = Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number().required()).length(2).required()
});
module.exports.routeCreateValidation = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    segons: Joi.number().min(1).required(),
    modalitat: Joi.number().min(1).max(3).required(),
    locations: Joi.array().items(locationSchema).required(),
    user: Joi.number().optional()
});

module.exports.routeUpdateValidation = Joi.object({
    title: Joi.string().min(3).max(50).optional(),
});