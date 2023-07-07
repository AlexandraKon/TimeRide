const { default: mongoose } = require("mongoose");
const Post = require("../models/db/Post");
const Comment = require("../models/db/Comment");
const Route = require("../models/db/Route");

module.exports.validateUserPost = async (req, res, next) => {
    const response = { status: 500, message: 'Server error' };
    try {
        const postId = req.params.id;
        const userId = req.token.id;
        const data = {
            model: Post,
            _id: mongoose.Types.ObjectId(postId),
        }
        const doc = await data.model.findOne(data);
        console.log(doc);
        if (doc.user == userId || req.token.admin == true) {
            next();
        } else {
            response.status = 401;
            response.message = 'User unauthorized';
            return res.status(response.status).send(response);
        }
    } catch (error) {
        response.message = `Post not found`;
        console.log(`ERROR post not found`, error);
        return res.status(response.status).send(response);
    }
}

module.exports.validateUserComment = async (req, res, next) => { //no funciona
    const response = { status: 500, message: 'Server error' };
    try {
        const commentId = req.params.id;
        const userId = req.token.id;
        const data = {
            model: Post,
            _id: mongoose.Types.ObjectId(commentId),
        }
        const posts = await data.model.find();
        console.log(posts);
        for (const post of posts) {
            const comment = post.comments.id(data._id);
            if (comment) {
                console.log(comment);
                if (comment.user == userId || req.token.admin == true) {
                    next();
                } else {
                    response.status = 401;
                    response.message = 'User unauthorized';
                    return res.status(response.status).send(response);
                }
            }
        }
        next(); 
    } catch (error) {
        response.message = `Comment not found`;
        console.log(`ERROR comment not found`, error);
        return res.status(response.status).send(response);
    }
}

module.exports.validateUserRoute = async (req, res, next) => {
    const response = { status: 500, message: 'Server error' };
    try {
        const routeId = req.params.id;
        const userId = req.token.id;
        const data = {
            model: Route,
            _id: mongoose.Types.ObjectId(routeId),
        }
        const doc = await data.model.findOne(data);
        console.log(doc);
        if (doc.user == userId || req.token.admin == true) {
            next();
        } else {
            response.status = 401;
            response.message = 'User unauthorized';
            return res.status(response.status).send(response);
        }
        next(); 
    } catch (error) {
        response.message = `Route not found`;
        console.log(`ERROR route not found`, error);
        return res.status(response.status).send(response);
    }
}

module.exports.validateUserDelete = (req, res, next) => {
    const response = { status: 500, message: 'Server error' };
    if (req.token.admin == true || req.token.id == req.params.id) {
        next();
    } else {
        response.status = 401;
        response.message = 'User unauthorized';
        return res.status(response.status).send(response);
    }
}

module.exports.validateAdmin = (req, res, next) => {
    const response = { status: 500, message: 'Server error' };
    if (req.token.admin == true) {
        next();
    } else {
        response.status = 401;
        response.message = 'User unauthorized';
        return res.status(response.status).send(response);
    }
}