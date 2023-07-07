const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        user: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

/**Create mongoose Schema */
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: [
            commentSchema
        ],
        viewsCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: Number,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        profilePicture: String,
        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            required: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Post', postSchema);