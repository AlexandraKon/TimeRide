const PostModel = require("../models/db/Post");


module.exports.getById = async(data) => {
    try {
        const doc = await data.model.findOne(data); // findOne({_id: 1234})
        return {
            status: true,
            result: doc
        }
    } catch (err) {
        console.log('Repository-getById:', err);
        return { status: false };
    }
};

module.exports.getByIdAndUpdate = async(postId) => {
    try {
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewsCount: 1},
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({
                        msg: "Fall get this post",
                    });
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Post not found!'
                    })
                }
                res.json(doc);
            },
        ).populate('user');
    } catch (err) {
        console.log('Repository-getByIdAndUpdate:', err);
        return { status: false };
    }
};

module.exports.getAll = async(data) => {
    try {
        const doc = await data.model.find(data.findQuery, data.projection).skip(data.skip).limit(data.limit);
        return {
            status: true,
            result: doc
        }
    } catch (err) {
        console.log('Repository-getAll:', err);
        return { status: false };
    }
};

module.exports.getUserPosts = async({ user }) => {
    try {
        const doc = await PostModel.find({ user });
        return {
            status: true,
            result: doc
        }
    } catch (err) {
        console.log('Repository-getAll:', err);
        return { status: false };
    }
};


module.exports.create = async(objToSave) => {
    try {
        const doc = await objToSave.save();
        return {
            status: true,
            result: doc
        }
    } catch (err) {
        console.log('Repository-create:', err);
        // res.status(500).json({
        //     msg: "failed to create a new post",
        // });
    }
    return { status: false };
};

module.exports.update = async (data) => {
    try {
        const doc = await data.model.findOneAndUpdate(data.findQuery, data.findUpdate, {
            projection: data.projection,
            new: true,
            useFindAndModify: false,
        });
        if (doc) {
            return {
            status: true,
            result: doc
            };
        }
    } catch (err) {
        console.log('Repository-update:', err);
    }
    return { status: false };
};

module.exports.delete = async (data) => {
    try {
        const doc = await data.model.findOneAndDelete(data.findQuery, { projection: data.projection });
        if (doc) {
            return {
            status: true,
            result: doc
            }
        }
    } catch (err) {
        console.log('Repository-delete:', err);
    }
    return { status: false };
};

module.exports.getFiveTags = async(data) => {
    try {
        const doc = await data.model.find().limit(5).exec();
        const tags = doc.map(obj => obj.tags).flat().slice(0 , 5);
        return {
            status: true,
            result: tags
        }
    } catch (err) {
        console.log('Repository-getFiveTags:', err);
        return { status: false };
    }
};

module.exports.getAllCommentsOfPost = async(data) => {
    try {
        const doc = await data.model.find(data).exec();
        const coms = doc.map(obj => obj.comments).flat(); 
        return {
            status: true,
            result: coms
        }
    } catch (err) {
        console.log('Repository-getAllCommentsOfPost:', err);
        return { status: false };
    }
};

module.exports.getAllComments = async(data) => {
    try {
        const doc = await data.model.find().exec();
        const coms = doc.map(obj => obj.comments).flat();
        return {
            status: true,
            result: coms
        }
    } catch (err) {
        console.log('Repository-getAllComments:', err);
        return { status: false };
    }
};

module.exports.getCommentById = async(data) => {
    try {
        const posts = await data.model.find();
        for (const post of posts) {
            const comment = post.comments.id(data.findQuery);
            if(comment) {
                return {
                    status: true,
                    result: comment
                }
            }
        }
    } catch (err) {
        console.log('Repository-getCommentById:', err);
        return { status: false };
    }
};

module.exports.deleteComment = async (data) => {
    try {
        const posts = await data.model.find();
        for (const post of posts) {
            const comment = post.comments.id(data.findQuery);
            if (comment) {
                comment.remove();
                const doc = await post.save();
                return {
                    status: true,
                    result: doc
                }
            }
        }
    } catch (err) {
        console.log('Repository-deleteComment:', err);
    }
    return { status: false };
};

module.exports.updateComment = async (data) => {
    try {
        const posts = await data.model.find();
        for (const post of posts) {
            const comment = post.comments.id(data.findQuery);
            if (comment) {
                comment.text = data.findUpdate.text;
                const doc = await post.save();
                return {
                    status: true,
                    result: doc
                }
            }
        }
    } catch (err) {
        console.log('Repository-updateComment:', err);
    }
    return { status: false };
};