module.exports.getMiddlewareValidate = (schema, objectToValidate) => {
    return (req, res, next) => {
        if (objectToValidate === 'body') objectToValidate = req.body;
        if (objectToValidate === 'params') objectToValidate = req.params;
        if (objectToValidate === 'query') objectToValidate = req.query;
    
        const result = schema.validate(objectToValidate);
        if (result.error) {
            const errorDetails = result.error.details.map((value) => value.message);
            const responseObj = {
                status: 400,
                body: errorDetails
            };
            return res.status(responseObj.status).send(responseObj);
        }
        else next();
    }
};