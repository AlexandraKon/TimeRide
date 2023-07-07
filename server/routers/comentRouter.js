/** Import express */
const express = require('express');
/** Create router */
const router = express.Router();

const tokenValidation = require('../middlewares/tokenValidation');
const postController = require('../controllers/postController');

const validation = require('../validations/validations');
const handleValidationError = require('../middlewares/handleValidationError');
const validateUser = require('../middlewares/validateUser');

//Joi validation
// const joiMiddleware = require('../middlewares/joiMiddleware');
// const commentSchemas = require('../models/joi/commentSchemas');


/** Get request - get all comments */
router.get('/',
    tokenValidation.validate,
    // joiMiddleware.getMiddlewareValidate(commentSchemas.commentsPagination, 'query'),
    postController.getAllComments
);
/** Get request - get all comments of post */
router.get('/:id',
    tokenValidation.validate,
    // joiMiddleware.getMiddlewareValidate(commentSchemas.commentId, 'params'),
    postController.getAllCommentsOfPost
);
/** Get request - get one comment by id */
router.get('/one/:id',
    tokenValidation.validate,
    // joiMiddleware.getMiddlewareValidate(commentSchemas.commentId, 'params'),
    postController.getOneCommentById
);
/** Post request - create comment */
router.post('/:id',
    tokenValidation.validate,
    validation.commentCreateValidation, handleValidationError.handleValidate,
    // joiMiddleware.getMiddlewareValidate(commentSchemas.commentId, 'params'),
    // joiMiddleware.getMiddlewareValidate(commentSchemas.commentCreateValidation, 'body'),
    postController.createComment
);
/** Delete request - delete one comment with only comment id */
router.delete('/:id',
    tokenValidation.validate,
    validateUser.validateUserComment,
    // joiMiddleware.getMiddlewareValidate(commentSchemas.commentId, 'params'),
    postController.deleteComment
);
/** Put request - update one comment with only comment id */
router.put('/:id',
    tokenValidation.validate,
    validateUser.validateUserComment,
    // joiMiddleware.getMiddlewareValidate(commentSchemas.commentId, 'params'),
    // joiMiddleware.getMiddlewareValidate(commentSchemas.commentUpdateValidation, ),
    postController.updateComment
);

module.exports = router;