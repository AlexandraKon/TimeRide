const { body } = require ('express-validator');

module.exports.registerValidator = [
    body('username', 'Username is incorrect').isLength({ min: 5 }),
    body('mail', 'Email is incorrect').isEmail(),
    body('password', 'Password is incorrect').isLength({ min: 5 }),
    body('name', 'Name is incorrect').optional().isLength({ min: 3 }).isString(),
    body('profilePicture', 'ProfilePicture  URL is incorrect').optional().isURL(),
    body('city', 'Name is incorrect').optional().isLength({ min: 3 }).isString(),
    body('occupation', 'Name is incorrect').optional().isLength({ min: 3 }).isString(),
];

module.exports.loginValidator = [
    body('username', 'Username is incorrect').isLength({ min: 5 }),
    body('password', 'Password is incorrect').isLength({ min: 5 }),
];

module.exports.postCreateValidator = [
    body('title', 'Write a title of this post').isLength({ min: 3 }).isString(),
    body('text', 'Write a text of this post').isLength({ min: 3 }).isString(),
    body('tags', 'The format of tags is incorrect').optional().isArray(),
    body('imageUrl', 'Image URL is incorrect').optional().isString(),
];

module.exports.routeCreateValidator = [
    body('title', 'Write a title of this route').isLength({ min: 3, max: 50 }).isString(),
    body('segons', 'Seconds is incorrect').isInt({ min: 1 }),
    body('modalitat', 'Modalitat is incorrect').isInt({ min: 1, max: 3 }),
    // Validación del array de localización
    body('locations', 'Location must be an array of GeoJSON Objects').isArray().custom((value) => {
        // Validar cada objeto GeoJSON en el array
        for (const locationObj of value) {
            if (
                !locationObj.type ||
                locationObj.type !== 'Point' || // Puedes cambiar el tipo de objeto GeoJSON según tus necesidades
                !locationObj.coordinates ||
                !Array.isArray(locationObj.coordinates) ||
                locationObj.coordinates.length !== 2 ||
                typeof locationObj.coordinates[0] !== 'number' ||
                typeof locationObj.coordinates[1] !== 'number'
            ) {
                throw new Error('Invalid GeoJSON Object in location array');
            }
        }
        return true;
    }),
    body('user').optional().isInt()
];

module.exports.commentCreateValidation = [
    body('text', 'Write a text of this post').isLength({ min: 3 }).isString(),
    body('user').optional().isInt()
]