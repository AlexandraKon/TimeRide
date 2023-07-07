const routeService = require('../utils/routeService');

/**Get All routes */
module.exports.getAllRoutes =  async (req, res) => {
    const response = { status: 500, message: 'Server error'};
    try {
        const responseFromService = await routeService.getAll(req.query.skip, req.query.limit);
        if (responseFromService.status) {
            if (responseFromService.result) {
            response.status = 200;
            response.message = 'Routes fetched successfully!';
            response.result = responseFromService.result;
            } else {
            response.status = 404;
            response.message = 'Routes not found';
            }
        }
    } catch (err) {
        console.log('RouteController-getAll:', err);
    }
    return res.status(response.status).send(response);
};

/** Get one route by id*/
module.exports.getOneRouteById = async (req, res) => {
    const response = { status: 500, message: 'Server error'};
    try {
        const routeId = req.params.id;

        const responseFromService = await routeService.getById(routeId);
        if (responseFromService.status) {
        if (responseFromService.result) {
            response.status = 200;
            response.message = 'Route fetched successfully!';
            response.result = responseFromService.result;
        } else {
            response.status = 404;
            response.message = 'Route not found';
        }
        }
    } catch (err) {
        console.log('RouteController-getById:', err);
    }
    return res.status(response.status).send(response);
};

/** Create a route */
module.exports.createRoute = async (req, res) => {
    
    const response = { status: 500, message: 'Server error'};
    try {
        const newRoute = req.body;
        if(!req.token.id) {
            return res.status(401).json('Unauthorized');
        }
        newRoute.user = req.token.id;

        const responseFromService = await routeService.create(newRoute);
        if ( responseFromService.status ) {
            response.status = 201;
            response.message = 'Route created successfully';
            response.result = responseFromService.result;
        }
    } catch (err) {
        console.log('RouteController.createRoute: ' + err.message);
    };
    return res.status(response.status).send(response);
};

/** Delete one route by id*/
module.exports.deleteRoute = async (req, res) => {
    const response = { status: 500, message: 'Server Error'};
    try {
        const routeId = req.params.id;

        const responseFromService = await routeService.delete(routeId);
        if (responseFromService.status) {
            response.status = 204;
            response.message = 'Route deleted successfully!';
            response.result = responseFromService.result;
        } else {
            response.status = 404;
            response.message = 'Route id not found!';
        }
    } catch (err) {
        console.log('RouteController-delete:', err);
    }
    return res.status(response.status).send(response);
};

/** Update route */
module.exports.updateRoute = async (req, res) => {
    const response = { status: 500, message: 'Server error'};
    try {
        const route = req.body;
        route.id = req.params.id;

        const responseFromService = await routeService.update(route);
        if (responseFromService.status) {
        response.status = 200;
        response.message = 'Route updated successfully!';
        response.result = responseFromService.result;
        }
    } catch (err) {
        console.log('RouteController-update:', err);
    }
    return res.status(response.status).send(response);
};