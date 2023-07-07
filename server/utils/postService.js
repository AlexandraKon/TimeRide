const mongoose = require('mongoose');
const Post = require('../models/db/Post');
const Comment = require('../models/db/Comment');
const repository = require('../database/repository');

module.exports.getById = async (postId) => {
    try {
        const data = {
            model: Post,
            _id: mongoose.Types.ObjectId(postId),
        }
        const responseFromRepository = await repository.getById(data);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-getById:', err);
    }
    return { status: false };
};

module.exports.getByIdAndUpdate = async (postId) => {
    try {
        const responseFromRepository = await repository.getByIdAndUpdate(postId);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-getById:', err);
    }
    return { status: false };
};

module.exports.getAll = async (skip, limit) => {
    try {
        const data = {
            model: Post,
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
        console.log('PostService-getFiveTags:', err);
    }
    return { status: false };
}

module.exports.getUserPosts = async ( { user }) => { // Añadir el parámetro userId
    try {
        const responseFromRepository = await repository.getUserPosts({ user });
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-getAll:', err);
    }
    return { status: false };
}


module.exports.getAllTags = async (skip, limit) => {
    try {
        const data = {
            model: Post,
            findQuery: {},
            projection: {},
            skip,
            limit,
        }
        const responseFromRepository = await repository.getFiveTags(data);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-getFiveTags:', err);
    }
    return { status: false };
};

module.exports.create = async (post) => {
    try {
        const postToSave = new Post(post);
        const responseFromRepository = await repository.create(postToSave);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-create:', err);
    }
    return { status: false };
};

module.exports.update = async (post) => {
    try {
        const data = {
            model: Post,
            findQuery: { _id: mongoose.Types.ObjectId(post.id) },
            findUpdate: {},
            projection: {},
        };
        if (post.title) data.findUpdate.title = post.title;
        if (post.text) data.findUpdate.text = post.text;
        if (post.tags) data.findUpdate.tags = post.tags;
        if (post.imageUrl) data.findUpdate.imageUrl = post.imageUrl;
        const responseFromRepository = await repository.update(data);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-update:', err);
    }
    return { status: false };
}

module.exports.delete = async (postId) => {
    try {
        const data = {
            model: Post,
            findQuery: { _id: mongoose.Types.ObjectId(postId) },
            projection: {},
        };
        const responseFromRepository = await repository.delete(data);

        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-delete:', err);
    }
    return { status: false };
}

module.exports.createComment = async (comment, postId) => {
    try {
        const commentToSave = new Comment(comment);
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error(`PostService-createComment: post with ID ${postId} not found`);
        }

        post.comments.push(commentToSave);
        const responseFromRepository = await repository.create(post);

        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-createComment:', err);
    }
    return { status: false };
};

module.exports.getAllCommentsOfPost = async (postId) => {
    try {
        const data = {
            model: Post,
            _id: mongoose.Types.ObjectId(postId),
        }
        const responseFromRepository = await repository.getAllCommentsOfPost(data);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-getAllComments:', err);
    }
    return { status: false };
};

module.exports.getAllComments = async (skip, limit) => {
    try {
        const data = {
            model: Post,
            findQuery: {},
            projection: {},
            limit,
            skip
        }
        const responseFromRepository = await repository.getAllComments(data);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-getAllComments:', err);
    }
    return { status: false };
};

module.exports.getCommentById = async (commentId) => {
    try {
        const data = {
            model: Post,
            findQuery: { _id: mongoose.Types.ObjectId(commentId) }
        }
        const responseFromRepository = await repository.getCommentById(data);
        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-getCommentById:', err);
    }
    return { status: false };
};

module.exports.deleteComment = async (commentId) => {
    try {
        const data = {
            model: Post,
            findQuery: { _id: mongoose.Types.ObjectId(commentId) },
            projection: {},
        };
        const responseFromRepository = await repository.deleteComment(data);

        if (responseFromRepository.status) {
            return responseFromRepository;
        }
    } catch (err) {
        console.log('PostService-deleteComment:', err);
    }
    return { status: false };
}
