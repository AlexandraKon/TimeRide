/** Import express */
const express = require("express");
/** Create router */
const router = express.Router();

const tokenValidation = require("../middlewares/tokenValidation");
const userController = require("../controllers/userController");
const validateUser = require("../middlewares/validateUser");

/** Get request - getUser*/
router.get("/:id", 
    tokenValidation.validate, 
    userController.getUser
);

/** Get request - getUserFriends*/
router.get("/:id/friends", 
    tokenValidation.validate, 
    userController.getUserFriends
);

/** Get request - get all users */
router.get('/',
    tokenValidation.validate,
    validateUser.validateAdmin,
    userController.getUsers
);

/* UPDATE request -addRemoveFriend*/
router.patch("/:id/:friendId", 
    tokenValidation.validate, 
    userController.addRemoveFriend
);

/** Update request - update user */
router.put("/:id",
    tokenValidation.validate,
    validateUser.validateUserDelete,
    userController.updateUser, 
);

/** Delete request - get all users */
router.delete('/:id',
    tokenValidation.validate,
    validateUser.validateUserDelete,
    userController.deteleUser
);

router.get('/profile/:id',
    userController.getProfilePicture
);

module.exports = router;