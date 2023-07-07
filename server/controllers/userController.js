const pool = require("../database/connection");
const fs = require('fs');
const path = require('path');


/** Get User By Id */
module.exports.getUser = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute(
      "SELECT * FROM Usuari WHERE idUsuari = ?",
      [req.params.id]
    );
    await connection.release();

    if (!rows.length)
      return res.status(404).json({ message: "User not found!" });

    // Destructure the user data, excluding the password
    const { password, ...userData } = rows[0];

    // return response
    return res.status(200).json({
      ...userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUserFriends = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const getUserQuery = "SELECT * FROM Usuari WHERE idUsuari = ?";

    const [rows, fields] = await connection.execute(getUserQuery, [
      req.params.id,
    ]);

    if (!rows.length)
      return res.status(404).json({ message: "User not found!" });

    const user = rows[0];
    const friendIds = JSON.parse(user.friends);

    const sqlFriends = "SELECT * FROM Usuari WHERE idUsuari IN (?)";

    const [rowsFriend, fieldsFriend] = await connection.execute(sqlFriends, [
      friendIds,
    ]);

    const formattedFriends = rowsFriend.map(
      ({
        idUsuari,
        username,
        mail,
        name,
        occupation,
        city,
        profilePicture,
      }) => {
        return {
          idUsuari,
          username,
          mail,
          name,
          occupation,
          city,
          profilePicture,
        };
      }
    );
    await connection.release();
    // return response
    return res.status(200).json(formattedFriends);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/** Add/Remove Friend */
module.exports.addRemoveFriend = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const { id, friendId } = req.params;
    const getUserQuery = "SELECT * FROM Usuari WHERE idUsuari = ?";
    const updateUserQuery = "UPDATE Usuari SET friends = ? WHERE idUsuari = ?";

    const [rows, fields] = await connection.execute(getUserQuery, [id]);

    if (!rows.length)
      return res.status(404).json({ message: "User not found!" });

    const user = rows[0];
    const userFriends = Array.isArray(JSON.parse(user.friends)) ? JSON.parse(user.friends) : [];
    console.log(userFriends);
    

    const [rowsFriend, fieldsFriend] = await connection.execute(getUserQuery, [
      friendId,
    ]);

    if (!rowsFriend.length)
      return res.status(404).json({ message: "Friend not found!" });

    const friend = rowsFriend[0];
    const friendFriends = Array.isArray(JSON.parse(friend.friends)) ? JSON.parse(friend.friends) : [];

    if (userFriends.includes(friendId)) {
      const updatedUserFriends = userFriends.filter((id) => id !== friendId);
      const updatedFriendFriends = friendFriends.filter((id) => id !== id);
      await connection.execute(updateUserQuery, [
        JSON.stringify(updatedUserFriends),
        id,
      ]);

      await connection.execute(updateUserQuery, [
        JSON.stringify(updatedFriendFriends),
        friendId,
      ]);
      await connection.release();
      return res.status(200).json(updatedUserFriends);
    } else {
      userFriends.push(friendId);
      friendFriends.push(id);
      await connection.execute(updateUserQuery, [
        JSON.stringify(userFriends),
        id,
      ]);
      await connection.execute(updateUserQuery, [
        JSON.stringify(friendFriends),
        friendId,
      ]);
      await connection.release();
      return res.status(200).json(userFriends);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUsers = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute("SELECT * FROM Usuari");
    await connection.release();

    if (!rows.length)
      return res.status(404).json({ message: "Users not found!" });

    // const users = rows[0];
    const users = rows;

    // remove password hash
    const usersData = users.map(({ password, ...usersData }) => usersData);
    response.status = 200;
    response.message = "Users fetched successfully!";
    response.result = usersData;
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.message = "Internal server error!";
  }
  return res.status(response.status).json(response);
};

module.exports.deteleUser = async (req, res) => {
  const response = { status: 500, message: "Server error" };
  try {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute(
      "DELETE FROM Usuari WHERE idUsuari = ?",
      [req.params.id]
    );
    await connection.release();

    if (!rows)
      return res.status(404).json({ message: "Users not found!" });

    response.status = 200;
    response.message = "User deleted successfully!";
    response.result = rows;
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.message = "Internal server error!";
  }
  return res.status(response.status).json(response);
};

module.exports.updateUser = async (req, res) => {
  const response = { status: 500, message: "Server error" };

  try {
    const connection = await pool.getConnection();

    const params = req.params.id;
    const { name, profilePicture, city, occupation } = req.body;

    let updateUserQuery = "UPDATE Usuari SET";
    let updateValues = [];
    let setClause = "";

    // Check which fields are being updated and build the SET clause of the query
    if (name) {
      setClause += " name = ?,";
      updateValues.push(name);
    }
    if (profilePicture) {
      setClause += " profilePicture = ?,";
      updateValues.push(profilePicture);
    }
    if (city) {
      setClause += " city = ?,";
      updateValues.push(city);
    }
    if (occupation) {
      setClause += " occupation = ?,";
      updateValues.push(occupation);
    }

    // Remove the trailing comma from the SET clause
    setClause = setClause.slice(0, -1);

    updateUserQuery = `${updateUserQuery}${setClause} WHERE idUsuari = ?`;

    // Add the user id to the end of the update values array
    updateValues.push(params);

    const [rows, fields] = await connection.execute(updateUserQuery, updateValues);
    await connection.release();

    if (!rows) return res.status(404).json({ message: "User not found!" });

    response.status = 200;
    response.message = "User updated successfully!";
  } catch (err) {
    console.log("UserController-update:", err);
  }
  return res.status(response.status).json(response);
};

module.exports.getProfilePicture = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute(
      "SELECT * FROM Usuari WHERE idUsuari = ?",
      [req.params.id]
    );
    await connection.release();

    console.log(rows);

    if (!rows.length)
      return res.status(404).json({ message: "User not found!" });

    // Destructure the user data, excluding the password
    const { profilePicture } = rows[0];
    console.log(profilePicture);

    if(!profilePicture) {
      return res.status(404).json({ message: "Foto not found!" });
    }

    const absolutePath = path.join(__dirname, '../uploads/perfils', profilePicture);
    const stream = fs.createReadStream(absolutePath);

    console.log(absolutePath);

    stream.on('open', () => {
      res.set('ContentType', 'image/jpeg');
      stream.pipe(res);
    });

    stream.on('error', () => {
      res.status(404).json({ message: "Foto not found!" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};