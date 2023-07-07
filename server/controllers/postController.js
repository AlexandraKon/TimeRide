const PostService = require("../utils/postService");
const Post = require("../models/db/Post");
const pool = require("../database/connection");


/**Get All posts */
module.exports.getAllPosts = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const responseFromService = await PostService.getAll(
      req.query.skip,
      req.query.limit
    );
    console.log(responseFromService);
    if (responseFromService.status) {
      if (responseFromService.result) {
        response.status = 200;
        response.message = "Posts fetched successfully!";
        response.result = responseFromService.result;
      } else {
        response.status = 404;
        response.message = "Posts not found";
      }
    }
  } catch (err) {
    console.log("PostsController-getAll:", err);
  }
  return res.status(response.status).send(response);
};

module.exports.getUserPosts = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const { user } = req.params; // Obtener el userId de los parámetros de consulta
    const responseFromService = await PostService.getUserPosts({ user }); // Pasar userId al servicio
    if (responseFromService.status) {
      if (responseFromService.result) {
        response.status = 200;
        response.message = "Posts fetched successfully!";
        response.result = responseFromService.result;
      } else {
        response.status = 404;
        response.message = "Posts not found";
      }
    }
  } catch (err) {
    console.log("PostsController-getAll:", err);
  }
  return res.status(response.status).send(response);
};

/** Get one post by id*/
module.exports.getOnePostById = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const postId = req.params.id;
    const responseFromService = await PostService.getById(postId);
    if (responseFromService.status) {
      if (responseFromService.result) {
        response.status = 200;
        response.message = "Post fetched successfully!";
        response.result = responseFromService.result;
      } else {
        response.status = 404;
        response.message = "Post not found";
      }
    }
  } catch (err) {
    console.log("PostController-getById:", err);
  }
  return res.status(response.status).send(response);
};

/** Get posts by user id*/
module.exports.getUserPosts = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const post = await Post.find( { user: req.params.user });
    return res.status(200).json(post);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
  return res.status(response.status).send(response);
};

/** Get one post by id and update*/
module.exports.getOnePostByIdAndUpdate = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const postId = req.params.id;
    const responseFromService = await PostService.getByIdAndUpdate(postId);
    if (responseFromService.status) {
      if (responseFromService.result) {
        response.status = 200;
        response.message = "Post updated successfully!";
        response.result = responseFromService.result;
      } else {
        response.status = 404;
        response.message = "Post not found";
      }
    }
  } catch (err) {
    console.log("PostController-getById:", err);
  }
  return res.status(response.status).send(response);
};

/** Create a post */
module.exports.createPost = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const newPost = req.body;
    if (!req.token.id) {
      return res.status(401).json("Unauthorized");
    }

    newPost.user = req.token.id;

    const [rows, fields] = await connection.execute(
      "SELECT username, profilePicture FROM Usuari WHERE idUsuari = ?",
      [req.token.id]
    );
    await connection.release();

    if (!rows.length) return res.status(404).json({ message: "User not found!" });

    newPost.username = rows[0].username;
    newPost.profilePicture = rows[0].profilePicture;

    const responseFromService = await PostService.create(newPost);
    if (responseFromService.status) {
      const response = {
        status: 201,
        message: "Post created successfully",
        result: responseFromService.result,
      };
      return res.status(response.status).send(response);
    }
  } catch (err) {
    console.log("PostController.createPost: " + err.message);
    const response = {
      status: 500,
      message: "Server error",
    };
    return res.status(response.status).send(response);
  }
};

/** Delete one post by id*/
module.exports.deletePost = async (req, res) => {
  const response = { status: 500, message: "Server Error" };
  try {
    const postId = req.params.id;

    const responseFromService = await PostService.delete(postId);
    if (responseFromService.status) {
      response.status = 200;
      response.message = "Post deleted successfully!";
      response.result = responseFromService.result;
    } else {
      response.status = 404;
      response.message = "Post id not found!";
    }
  } catch (err) {
    console.log("PostController-delete:", err);
  }
  return res.status(response.status).send(response);
};

/** Update post */
module.exports.updatePost = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const post = req.body;
    post.id = req.params.id;

    const responseFromService = await PostService.update(post);
    if (responseFromService.status) {
      response.status = 200;
      response.message = "Post updated successfully!";
      response.result = responseFromService.result;
    }
  } catch (err) {
    console.log("PostController-update:", err);
  }
  return res.status(response.status).send(response);
};

/**
 * Get last tags
 */
module.exports.getLastTags = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const responseFromService = await PostService.getAllTags(
      req.query.skip,
      req.query.limit
    );
    // console.log(responseFromService);
    if (responseFromService.status) {
      if (responseFromService.result) {
        response.status = 200;
        response.message = "Tags fetched successfully!";
        response.result = responseFromService.result;
      } else {
        response.status = 404;
        response.message = "Posts not found";
      }
    }
  } catch (err) {
    console.log("PostsController-getLastTags:", err);
  }
  return res.status(response.status).send(response);
};

/**
 * Get all comments
 */
module.exports.getAllComments = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const postId = req.params.id;
    const responseFromService = await PostService.getAllComments(postId);
    if (responseFromService.status) {
      if (responseFromService.result) {
        response.status = 200;
        response.message = "Comments fetched successfully!";
        response.result = responseFromService.result;
      } else {
        response.status = 404;
        response.message = "Post not found";
      }
    }
  } catch (err) {
    console.log("PostController-getAllComments:", err);
  }
  return res.status(response.status).send(response);
};

/**
 * Get all comments of one post
 */
module.exports.getAllCommentsOfPost = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const postId = req.params.id;
    const responseFromService = await PostService.getAllCommentsOfPost(postId);
    if (responseFromService.status) {
      if (responseFromService.result) {
        response.status = 200;
        response.message = "Comments fetched successfully!";
        response.result = responseFromService.result;
      } else {
        response.status = 404;
        response.message = "Post not found";
      }
    }
  } catch (err) {
    console.log("PostController-getAllComments:", err);
  }
  return res.status(response.status).send(response);
};

/**
 * Get one comment by id
 */
module.exports.getOneCommentById = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const commentId = req.params.id;
    const responseFromService = await PostService.getCommentById(commentId);
    if (responseFromService.status) {
      if (responseFromService.result) {
        response.status = 200;
        response.message = "Comment fetched successfully!";
        response.result = responseFromService.result;
      } else {
        response.status = 404;
        response.message = "Comment not found";
      }
    }
  } catch (err) {
    console.log("PostController-getOneCommentById:", err);
  }
  return res.status(response.status).send(response);
};

/**
 * Create comment
 */
module.exports.createComment = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const postId = req.params.id;
    const newComment = req.body;
    if (!req.token.id) {
      return res.status(401).json("Unauthorized");
    }
    newComment.user = req.token.id;

    const responseFromService = await PostService.createComment(
      newComment,
      postId
    );
    if (responseFromService.status) {
      response.status = 201;
      response.message = "Comment created successfully";
      response.result = responseFromService.result;
    }
  } catch (err) {
    console.log("PostController.createComment: " + err.message);
  }
  return res.status(response.status).send(response);
};

/**
 * Delete comment by comment id only
 */
module.exports.deleteComment = async (req, res) => {
  const response = { status: 500, message: "Server Error" };
  try {
    const commentId = req.params.id;

    const responseFromService = await PostService.deleteComment(commentId);
    if (responseFromService.status) {
      response.status = 204;
      response.message = "Comment deleted successfully!";
      response.result = responseFromService.result;
    } else {
      response.status = 404;
      response.message = "Comment id not found!";
    }
  } catch (err) {
    console.log("PostController-delete:", err);
  }
  return res.status(response.status).send(response);
};

/**
 * Update comment by comment id only
 */
module.exports.updateComment = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const comment = req.body;
    const commentId = req.params.id;

    const responseFromService = await PostService.updateComment(
      comment,
      commentId
    );
    if (responseFromService.status) {
      response.status = 200;
      response.message = "Comment updated successfully!";
      response.result = responseFromService.result;
    }
  } catch (err) {
    console.log("PostController-update:", err);
  }
  return res.status(response.status).send(response);
};

/**
 * Update like post
 */
module.exports.addLike = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.viewsCount = post.viewsCount + 1;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { viewsCount: post.viewsCount },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Error updating post' });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports.deleteLike = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.viewsCount !== 0) {
    post.viewsCount = post.viewsCount - 1;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { viewsCount: post.viewsCount },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Error updating post' });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getAllLikesOfPost = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const postId = req.params.id;
    const responseFromService = await PostService.getAllCommentsOfPost(postId);
    if (responseFromService.status) {
      if (responseFromService.result) {
        response.status = 200;
        response.message = "Comments fetched successfully!";
        response.result = responseFromService.result;
      } else {
        response.status = 404;
        response.message = "Post not found";
      }
    }
  } catch (err) {
    console.log("PostController-getAllComments:", err);
  }
  return res.status(response.status).send(response);
};