const express = require("express");
/** Import cors */
const cors = require("cors");
/** Import cookies parser */
const cookieParser = require("cookie-parser");
/**Import Helmet - para mejorar la seguridad de las aplicaciones web mediante la configuración de encabezados HTTP */
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const multer = require("multer");

/** Configuration js for reading variables in .env */
require("dotenv").config();

/** Import database MongoDB */
const db = require("./database/connect");

/** Import express session */
const session = require("express-session");

/** Create app express*/
const app = express();

/** Create storage for images by Multer */
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/perfils");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/** Read json requests */
app.use(express.json());
app.use(cors());

/** Create session for oauth */
app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

/** Middlewares para mejorar la app */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

/**Get request - for get STATIC file! */
app.use("/uploads/perfils", express.static("uploads"));

/** Apply cookies */
app.use(cookieParser());

/** Call module from folder database for create connection */
db.createConnectionMongo();

/** Request for auth */
app.use("/api/auth", require("./routers/authRouter"));
/** Request for posts */
app.use("/api/posts", require("./routers/postsRouter"));
/** Request for routes */
app.use("/api/routes", require("./routers/routeRoutes"));
/** Request for tags */
app.use("/api/tags", require("./routers/tagsRouter"));
/** Request for comments */
app.use("/api/comments", require("./routers/comentRouter"));
/** Request for users */
app.use("/api/users", require("./routers/usersRouter"));

app.post("/api/uploadprofile", upload.single("profilePicture"), (req, res) => {
  res.json({
    url: `/uploads/perfils/${req.file.originalname}`,
  });
});

/** Run web-server in localhost:4444*/
app.listen(process.env.PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server ok!");
});
