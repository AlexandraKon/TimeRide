/** Import express */
const express = require("express");
/** Import multer */
const multer = require("multer");

/** Create router */
const router = express.Router();

const tokenValidation = require("../middlewares/tokenValidation");
const postController = require("../controllers/postController");

const validation = require("../validations/validations");
const handleValidationError = require("../middlewares/handleValidationError");
const validateUser = require("../middlewares/validateUser");

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    //path to save images
    cb(null, "/uploads/posts");
  },
  filename: (_, file, cb) => {
    //path to save images
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/** Get request - get one post */
router.get("/:id", tokenValidation.validate, postController.getOnePostById);

/** Get request - get all posts */
router.get("/", tokenValidation.validate, postController.getAllPosts);

/** Get request - get all posts by user id */
router.get("/:user/posts", tokenValidation.validate, postController.getUserPosts);

/** Post request - create post */
router.post(
  "/",
  tokenValidation.validate,
  validation.postCreateValidator,
  handleValidationError.handleValidate,
  upload.single("image"),
  postController.createPost
);

/** Delete request - delete post */
router.delete("/:id", tokenValidation.validate, validateUser.validateUserPost, postController.deletePost);

/** Put request - update post */
router.put("/:id", tokenValidation.validate, validateUser.validateUserPost, postController.updatePost);

/** Get request - get last five tags */
router.get("/tags", postController.getLastTags);

/** Patch request - update likes */
router.patch("/:id/like", tokenValidation.validate, postController.addLike);
router.patch("/:id/dellike", tokenValidation.validate, postController.deleteLike);

module.exports = router;
