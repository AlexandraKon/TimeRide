const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports.postId = Joi.object({
    id: Joi.objectId().required(),
});

module.exports.postsPagination = Joi.object({
    skip: Joi.number().integer(),
    limit: Joi.number().integer(),
}).and('skip', 'limit');

module.exports.postCreateValidation = Joi.object({
    title: Joi.string().max(50).required(),
    text: Joi.string().min(2).max(120).required(),
    tags: Joi.optional(),
    imageUrl: Joi.string().optional(),
    route: Joi.string().required(),
    comments: Joi.array(),
    user: Joi.number().optional(),
});

module.exports.postUpdateValidation = Joi.object({
    title: Joi.string().min(3).max(50).optional(),
    text: Joi.string().min(2).max(120).optional(),
    tags: Joi.optional(),
    imageUrl: Joi.string().optional(),
});