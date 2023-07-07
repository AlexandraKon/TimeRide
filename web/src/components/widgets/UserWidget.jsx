import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dialog, DialogTitle, Grid } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

import UserImage from "components/UserImage";
import FlexBetween from "components/styles/FlexBetween";
import WidgetWrapper from "components/widgets/WidgetWrapper";
import axios from "../../axios";
import linkedin from "../../assets/logo/linkedin.png";
import twitter from "../../assets/logo/twitter.png"

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const { palette } = useTheme();
  const navigate = useNavigate();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const { idUsuari } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageSelect = async (image) => {
    const values = {
      profilePicture: image,
    };
    try {
      const response = await axios.put(`/api/users/${idUsuari}`, values);
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return null;
  }

  const {
    username,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return randomNumber.toString().padStart(6, "0");
  };

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      {!loading ? (
        <>
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem" onClick={() => navigate(`/profile/${userId}`)}>
          <UserImage id={userId} image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {username}
            </Typography>
            {/* <Typography color={medium}>{friends.length} friends</Typography> */}
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }} onClick={() => navigate(`/update-user`)} />
      </FlexBetween>
      <Divider />

      <Button
        fullWidth
        onClick={handleOpen}
        sx={{
          m: "1rem 0",
          p: "1rem",
          backgroundColor: palette.background.alt,
          color: palette.primary.main,
        }}
      >
        <FormattedMessage id="user.change" defaultMessage="Change Profile Picture" />
      </Button>
      <Divider />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select a profile picture</DialogTitle>
        <Grid container spacing={2} justify="center" alignItems="center">
          {[...Array(9)].map((_, i) => (
            <Grid item key={i}>
              <img
                style={{ cursor: "pointer", borderRadius: "50%" }}
                width={160}
                height={160}
                alt={`Profile ${i + 1}`}
                src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${generateRandomNumber()}`}
                onClick={() =>
                  handleImageSelect(
                    `https://api.dicebear.com/6.x/adventurer/svg?seed=${generateRandomNumber()}`
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      </Dialog>

      {/* SECOND ROW */}
      <Box p="1rem 0">
        {location && (
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{location}</Typography>
          </Box>
        )}
        {occupation && (
          <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{occupation}</Typography>
          </Box>
        )}
      </Box>

      {/* THIRD ROW */}
      {/* FOURTH ROW */}
      <Box p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          <FormattedMessage id="user.profiles" defaultMessage="Social Profiles" />
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
  
          <FlexBetween gap="1rem">
            <FlexBetween gap="1rem">
              <img src={linkedin} alt="linkedin" />
              <Box>
                <Typography color={main} fontWeight="500">
                  Linkedin
                </Typography>
                <Typography color={medium}>TimeRide</Typography>
              </Box>
            </FlexBetween>
            
          </FlexBetween>
        </Box>
        </>
      ) : (
        <CircularProgress />
      )}
    </WidgetWrapper>
  );
};

export default UserWidget;
