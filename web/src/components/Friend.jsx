import { useState, useEffect } from "react";

import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../redux/state";
import FlexBetween from "./styles/FlexBetween";
import UserImage from "./UserImage";
import axios from "../axios";


const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { idUsuari } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const [friendData, setFriendData] = useState([]);

const getFriends = async () => {
  const response = await axios.get(`/api/users/${idUsuari}/friends`);
  setFriendData(response.data);
};

useEffect(() => {
  getFriends();
}, []);

console.log(friendData);
console.log("aaaaafd");


const isFriend = friendData.find((friend) => friend === friendId);


  const patchFriend = async () => {
    const response = await axios.patch(`/api/users/${idUsuari}/${friendId}`);
  setFriendData(response.data);
    
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage id={friendId} image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;
