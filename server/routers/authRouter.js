/** Import express */
const express = require("express");
/** Import multer */
const multer = require("multer");
/** Create router */
const router = express.Router();

const passport = require("passport");
const passportSetup = require("../passport");
const jwt = require("jsonwebtoken");

const tokenValidation = require("../middlewares/tokenValidation");
const authController = require("../controllers/authController");

//New validation
const validation = require("../validations/validations");
const handleValidationError = require("../middlewares/handleValidationError");

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    //path to save images
    cb(null, "uploads/perfils");
  },
  filename: (_, file, cb) => {
    //path to save images
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/** Post request - registration*/
router.post(
  "/register",
  validation.registerValidator,
  handleValidationError.handleValidate,
  upload.single("image"),
  authController.register
);

/** Post request - login*/
router.post(
  "/login",
  validation.loginValidator,
  handleValidationError.handleValidate,
  authController.login
);

/** Post request - logout */
router.post("/logout", authController.logout);

/** Get request - account me with check authorization*/
router.get("/me", tokenValidation.validate, authController.getMe);

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "http://localhost:3000/",
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.idUsuari,
        admin: req.user.admin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "300d",
      }
    );

    return res
      .cookie("accessToken", token, {
        httpOnly: false,
      })
      .redirect('http://localhost:3000/');
  }
);

router.post("/forgot-password", authController.forgotPass);

router.get("/reset-password/:id/:token", authController.resetPassGet);

router.post("/reset-password/:id/:token", authController.resetPassPost);

router.get("/admin", tokenValidation.validate, authController.admin);


module.exports = router;