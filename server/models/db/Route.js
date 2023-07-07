const mongoose = require('mongoose');

/**Create mongoose Schema */
const routeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        segons: {
            type: Number,
            required: true,
        },
        modalitat: {
            type: Number,
            required: true,
        },
        locations: {
            type: Array,
            default: [],
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

module.exports = mongoose.model('Route', routeSchema);