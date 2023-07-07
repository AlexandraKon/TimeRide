const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports.commentId = Joi.object({
    id: Joi.objectId().required(),
});

module.exports.commentsPagination = Joi.object({
    skip: Joi.number().integer(),
    limit: Joi.number().integer(),
}).and('skip', 'limit');

module.exports.commentCreateValidation = Joi.object({
    text: Joi.string(),//.min(2).max(120).required(),
    user: Joi.number().optional(),
});

module.exports.commentUpdateValidation = Joi.object({
    text: Joi.string().min(2).max(120).optional(),
});