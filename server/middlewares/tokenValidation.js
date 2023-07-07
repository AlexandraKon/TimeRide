const jwt = require(`jsonwebtoken`);

module.exports.validate = (req, res, next) => {
    const responseObj = { status: 400 };
    const bearerHeader = req.headers.authorization;
    const token = (bearerHeader || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.token = decoded;
            // console.log(decoded);
            next();
        } catch (error) {
            responseObj.message = `Invalid token`;
            console.log(`ERROR Invalid Token`, error);
            return res.status(responseObj.status).send(responseObj);
        }
    } else {
        responseObj.message = `Bearer token missing from header`;
        return res.status(responseObj.status).send(responseObj);
    }
}