import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";

import defaultProfile from "../assets/user-profile-default.png";
import axios from "../axios";

const UserImage = ({ id, image, size = "60px" }) => {
  const { idUsuari, profilePicture } = useSelector((state) => state.user);

  const getUserImage = async () => {
    const response = await axios.get(`/api/users/${id}`);

    const userPic = response.data.profilePicture;

    const isLink = /^(https):\/\//i.test(userPic);
    if (isLink) {
      return userPic;
    }
    return null;
  };

  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const image = await getUserImage();
      setProfilePic(image);
    }
    fetchData();
  }, []);

  return (
    <Box width={size} height={size}>
      {profilePic ? (
        <img
          style={{ objectFit: "cover", borderRadius: "50%" }}
          width={size}
          height={size}
          alt="user"
          src={profilePic}
        />
      ) : (
        <img
          style={{ objectFit: "cover", borderRadius: "50%" }}
          width={size}
          height={size}
          alt="default"
          src={defaultProfile}
        />
      )}
    </Box>
  );
};

export default UserImage;
