import { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "../widgets/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../redux/state";
import axios from "../../axios";
import { FormattedMessage } from "react-intl";


const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [friendData, setFriendData] = useState(null);

  console.log("friend list");
  console.log(friendData);

  const getFriends = async () => {
    const response = await axios.get(`/api/users/${userId}/friends`);
    setFriendData(response.data);
    // dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        <FormattedMessage id="friends.list" defaultMessage="Friend List" />
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friendData && friendData.map((friend) => (
          <Friend
            key={friend.idUsuari}
            friendId={friend.idUsuari}
            name={friend.username}
            subtitle={friend.city}
            userPicturePath={friend.profilePicture}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
