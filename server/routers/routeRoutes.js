/** Import express */
const express = require('express');
/** Create router */
const router = express.Router();

const tokenValidation = require('../middlewares/tokenValidation');
const routeController = require('../controllers/routeController');

const validation = require('../validations/validations');
const handleValidationError = require('../middlewares/handleValidationError');
const validateUser = require('../middlewares/validateUser');

// Joi Validation
const joiMiddleware = require('../middlewares/joiMiddleware');
const routeSchema = require('../models/joi/routeSchemas');

/** Get request - get one route */
router.get('/:id',
    tokenValidation.validate,
    // joiMiddleware.getMiddlewareValidate(routeSchema.routeId, 'params'),
    routeController.getOneRouteById
);

/** Get request - get all routes */
router.get('/',
    tokenValidation.validate,
    // joiMiddleware.getMiddlewareValidate(routeSchema.routesPagination, 'query'),
    routeController.getAllRoutes
);

/** Routes request - create route */
router.post('/',
    tokenValidation.validate,
    validation.routeCreateValidator, handleValidationError.handleValidate,
    // joiMiddleware.getMiddlewareValidate(routeSchema.routeCreateValidation, 'body'),
    routeController.createRoute
);

/** Delete request - delete route */
router.delete('/:id',
    tokenValidation.validate,
    validateUser.validateUserRoute,
    // joiMiddleware.getMiddlewareValidate(routeSchema.routeId, 'params'),
    routeController.deleteRoute
);

/** Put request - update route */
router.put('/:id',
    tokenValidation.validate,
    validateUser.validateUserRoute,
    // joiMiddleware.getMiddlewareValidate(routeSchema.routeId, 'params'),
    // joiMiddleware.getMiddlewareValidate(routeSchema.routeUpdateValidation, 'body'),
    routeController.updateRoute
);

module.exports = router;