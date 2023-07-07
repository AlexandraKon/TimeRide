/** Import express */
const express = require('express');
/** Create router */
const router = express.Router();

const joiMiddleware = require('../middlewares/joiMiddleware');
const postSchemas = require('../models/joi/postSchemas');
const postController = require('../controllers/postController');

router.get('/',
    // joiMiddleware.getMiddlewareValidate(postSchemas.postsPagination, 'query'),
    postController.getLastTags
);

module.exports = router;
