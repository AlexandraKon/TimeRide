const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");

const pool = require("./database/connection");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4444/api/auth/google/callback",
            passReqToCallback: true,
            scope: ["profile", "email"]
        },
        async function (request, accessToken, refreshToken, profile, done) {
            try {
                const connection = await pool.getConnection();
                const [rows, fields] = await connection.execute(
                    "SELECT `idUsuari`, `username`, `mail`, `name`, `admin` FROM Usuari WHERE mail = ?",
                    [profile._json.email]
                );

                if (rows.length) {
                    const userData = rows[0];
                    // console.log(userData);
                    return done(null, userData);
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const hashedPassword = bcrypt.hashSync("12345", salt);

                    const [rowsInsert, fieldsInsert] = await connection.execute(
                        "INSERT INTO Usuari (`username`, `mail`, `name`, `password`) VALUES (?, ?, ?, ?)",
                        [profile._json.name, profile._json.email, profile._json.name, hashedPassword]
                    );

                    const [user, algo] = await connection.execute(
                        "SELECT `idUsuari`, `username`, `mail`, `name` `admin` FROM Usuari WHERE idUsuari = ?",
                        [rowsInsert.insertId]
                    );

                    const userData = user[0];
                    // console.log(userData);
                    // done(null, userData);
                    return done(null, userData);
                }
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    return done(null, user);
});

passport.deserializeUser((user, done) => {
    return done(null, user);
});