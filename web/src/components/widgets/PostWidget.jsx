import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog,
  List,
  ListItem,
  ListItemText,
  CircularProgress,} from "@material-ui/core";

import { setPost } from "../../redux/state";
import FlexBetween from "components/styles/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "./WidgetWrapper";
import axios from "../../axios";
import linkedin from "../../assets/logo/linkedin.png";
import twitter from "../../assets/logo/twitter.png"

const PostWidget = ({
  postId,
  title,
  text,
  tags,
  postUserId,
  username,
  profilePicture,
  routeUserId,
  comments,
  viewsCount,
  imageUrl,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(false);
  const [open, setOpen] = useState(false);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const medium = palette.neutral.medium;


  const patchLike = async () => {
    if (!isLiked){
      const updatedPostLike = await axios.patch(`/api/posts/${postId}/like`,);
      console.log(updatedPostLike.data)
      dispatch(setPost({ post: updatedPostLike.data }));
      setIsLiked(true);
    } else {
      const updatedPostDis = await axios.patch(`/api/posts/${postId}/dellike`,);
      dispatch(setPost({ post: updatedPostDis.data }));
      setIsLiked(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={username}
        userPicturePath={profilePicture}
      />
      <Typography color={main} sx={{ mt: "1rem", fontSize: "1.2rem"}}>
        {title}
      </Typography>
      <Typography color={main} sx={{ mt: "1rem" }}>
        {text}
      </Typography>
      {imageUrl && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:4444/uploads/posts/${imageUrl}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{viewsCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton onClick={handleOpen} >
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {/* {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )} */}
      <Dialog open={open} onClose={() => setOpen(false)}>
              <Box m="3rem" p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Social Profiles
          </Typography>
  
          <FlexBetween gap="1rem" mb="0.5rem">
            <FlexBetween gap="1rem">
              <img src={twitter} alt="twitter" />
              <Box>
                <Typography color={main} fontWeight="500">
                  Twitter
                </Typography>
                <Typography color={medium}>TimeRide</Typography>
              </Box>
            </FlexBetween>
           
          </FlexBetween>
          <Divider />
          <FlexBetween gap="1rem">
            <FlexBetween gap="1rem">
              <img src={linkedin} alt="linkedin" />
              <Box m="1rem">
                <Typography  color={main} fontWeight="500">
                  Linkedin
                </Typography>
                <Typography color={medium}>TimeRide</Typography>
              </Box>
            </FlexBetween>
            
          </FlexBetween>
        </Box>
          </Dialog>

    </WidgetWrapper>
  );
};

export default PostWidget;
