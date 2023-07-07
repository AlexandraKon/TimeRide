const mongoose = require('mongoose');
const Route = require('../models/db/Route');
const repository = require('../database/repository');

module.exports.getById = async (routeId) => {
    try {
        const data = {
            model: Route,
            _id: mongoose.Types.ObjectId(routeId),
        }
        const responseFromRepository = await repository.getById(data);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('RouteService-getById:', err);
    }
    return { status: false };
};

module.exports.getAll = async (skip, limit) => {
    try {
        const data = {
            model: Route,
            findQuery: {},
            projection: {},
            skip,
            limit,
        }
        const responseFromRepository = await repository.getAll(data);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('RouteService-getAll:', err);
    }
    return { status: false };
};

module.exports.create = async (route) => {
    try {
        const routeToSave = new Route(route);
        const responseFromRepository = await repository.create(routeToSave);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('RouteService-create:', err);
    }
    return { status: false };
};

module.exports.update = async (route) => {
    try {
        const data = {
            model: Route,
            findQuery: { _id: mongoose.Types.ObjectId(route.id) },
            findUpdate: {},
            projection: {},
        };
        if (route.title) data.findUpdate.title = route.title;
        const responseFromRepository = await repository.update(data);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('RouteService-update:', err);
    }
    return { status: false };
}

module.exports.delete = async (routeId) => {
    try {
        const data = {
            model: Route,
            findQuery: { _id: mongoose.Types.ObjectId(routeId) },
            projection: {},
        };
        const responseFromRepository = await repository.delete(data);

        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('RouteService-delete:', err);
    }
    return { status: false };
}