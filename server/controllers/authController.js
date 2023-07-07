const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../database/connection");

var nodemailer = require("nodemailer");


/** Register - create a new user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Object} - Express response object with status code, user data and token, or error message
*/
module.exports.register = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(
      "SELECT * FROM Usuari WHERE username = ? OR mail = ?",
      [req.body.username, req.body.mail]
    );

    if (rows.length) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
    const [rowsInsert, fieldsInsert] = await pool.execute(
      "INSERT INTO Usuari (`username`,`mail`,`password`, `name`, `profilePicture`, `city`, `occupation`) VALUES (?, ?, ?, IFNULL(?, NULL), IFNULL(?, NULL), IFNULL(?, NULL), IFNULL(?, NULL))",
      [req.body.username, req.body.mail, hashedPassword, req.body.name || null, req.body.profilePicture || null, req.body.city || null, req.body.occupation || null]
    );

    const [user, algo] = await pool.execute(
      "SELECT * FROM Usuari WHERE idUsuari = ?",
      [rowsInsert.insertId]
    );

    const token = jwt.sign(
      {
        id: user[0].idUsuari,
        admin: user[0].admin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "300d",
      }
    );

    const { password, ...userData } = user[0];
    await connection.release();

    return res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        ...userData,
        token,
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/** Login - authenticate an existing user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Object} - Express response object with status code, user data and token, or error message
 */
module.exports.login = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [rows, fields] = await connection.execute(
      "SELECT * FROM Usuari WHERE username = ?",
      [req.body.username]
    );
    await connection.release();

    if (!rows.length) return res.status(404).json({ message: "User not found!" });

    const passwordMatch = await bcrypt.compare(req.body.password, rows[0].password);
    if (!passwordMatch) return res.status(401).json({ message: "Wrong password or username!" });

    const token = jwt.sign(
      {
        id: rows[0].idUsuari,
        admin: rows[0].admin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "300d",
      }
    );

    const { password, ...userData } = rows[0];

    return res
      .cookie("accessToken", token, {
      httpOnly: true,
      }).status(200).json({
        ...userData,
        token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/** Logout
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Object} - Express response object with status code, user data and token, or error message
  */
module.exports.logout = (req, res) => {
  // Verificar si existe el token de acceso
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: "No se ha iniciado sesión" });
  }

  // Verificar si el token es válido
  let payload;
  try {
    payload = jwt.verify(accessToken, "secret123");
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  // Borrar la cookie de accessToken
  return res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ message: "El usuario ha cerrado sesión" });
};

/** Get Me 
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Object} - Express response object with status code, user data and token, or error message
 */
module.exports.getMe = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(
      "SELECT * FROM Usuari WHERE idUsuari = ?",
      [req.token.id]
    );
    await connection.release();

    if (!rows.length) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Destructure the user data, excluding the password
    const { password, ...userData } = rows[0];

    return res.status(200).json({
      ...userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/** Admin 
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Object} - Express response object with status code, user data and token, or error message
 */
module.exports.admin = async (req, res) => {
  if(req.token.admin == true) {
    return res.status(200).json({
      admin: true,
    });
  } else {
    return res.status(401).json({
      admin: false,
    });
  }
};

/** Forgot Password
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Object} - Express response object with status code, user data and token, or error message
 */
module.exports.forgotPass = async (req, res) => {
  const mail = req.body.mail;

  try {

    const connection = await pool.getConnection();
    
    const [oldUser, fields] = await connection.execute(
      "SELECT * FROM Usuari WHERE mail = ?",
      [mail]
    );
    await connection.release();

    if (!oldUser.length) return res.status(404).json({ message: "User not found!" });

    const tokenUser = jwt.sign({ email: oldUser.email, id: oldUser.id }, process.env.SECRET_KEY, {
      expiresIn: "5m",
    });

    const link = `http://localhost:3000/reset-password/${oldUser.id}/${tokenUser}`;


    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "timeride42@gmail.com",
        pass: "whstmplwgqudplvo",
      },
    });
    let info = await transporter.sendMail({
      from: "timeride42@gmail.com",
      to: mail,
      subject: "Asunto del correo",
      text: "Contenido del correo en formato de texto plano",
      html: `<!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8">
        <title>TimeRide - Email Password</title>
      </head>
      <body>
      <!-- partial:index.partial.html -->
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">TimeRide</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing TimeRide. Use the following link to complete your Password Recovery Procedure. Link is valid for 5 minutes: ${link}</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"></h2>
          <p style="font-size:0.9em;">Regards,<br />TimeRide</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Timeride</p>
            <p>Barcelona</p>
          </div>
        </div>
      </div>
      <!-- partial -->
      </body>
      </html>`,

    }); 

    return res.status(200).json({
      message: "Correo electrónico enviado: %s",
      link: link
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error"});
  }
};

/** Reset Password getting name and gmail
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.resetPassGet = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [oldUser, fields] = await connection.execute(
      "SELECT * FROM Usuari WHERE idUsuari = ?",
      [req.params.id]
    );
    await connection.release();

    if (!oldUser.length) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({
      email: oldUser[0].mail,
      name: oldUser[0].name
    });

  } catch (error) {
    console.error("resetPassGet error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/** Reset password - post
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.resetPassPost = async (req, res) => {
  const response = { status: 500, message: "Server error" };

  try {
    const connection = await pool.getConnection();

    const userId = req.params.id;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUserQuery = "UPDATE Usuari SET password = ? WHERE idUsuari = ?";
    const updateValues = [hashedPassword, userId];

    const [rows, fields] = await connection.execute(updateUserQuery, updateValues);
    await connection.release();

    if (!rows) return res.status(404).json({ message: "User not found!" });

    response.status = 200;
    response.message = "Password updated successfully!";
  } catch (err) {
    console.log("UserController-updatePassword:", err);
  }

  return res.status(response.status).json(response);
};