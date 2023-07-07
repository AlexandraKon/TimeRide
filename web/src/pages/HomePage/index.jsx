import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "components/navbar";
import UserWidget from "components/widgets/UserWidget";
import MyPostWidget from "components/widgets/MyPostWidget";
import PostsWidget from "components/widgets/PostsWidget";
import WeatherWidget from "components/widgets/WeatherWidget";
import FriendListWidget from "components/widgets/FriendListWidget";

export const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { idUsuari, profilePicture } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={idUsuari} image={profilePicture} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget userId={idUsuari} picturePath={profilePicture} />
          <PostsWidget userId={idUsuari} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <WeatherWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={idUsuari} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
