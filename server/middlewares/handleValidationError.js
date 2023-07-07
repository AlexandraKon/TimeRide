const { validationResult } = require('express-validator');

/**Middleware */
module.exports.handleValidate = ( req, res, next ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
    next();
}