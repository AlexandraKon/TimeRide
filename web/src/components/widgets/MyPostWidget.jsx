import { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";

import FlexBetween from "components/styles/FlexBetween";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/widgets/WidgetWrapper";
import { setPosts } from "../../redux/state";
import axios from "../../axios";
import { FormattedMessage } from "react-intl";

const MyPostWidget = ({ userId, picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [route, setRoute] = useState("");
  const [open, setOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { palette } = useTheme();
  const { idUsuari } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    setLoading(true);
    try {
      const fields = {
        title: title,
        text: text,
        route: route,
      };
      const { data } = await axios.post("api/posts", fields);
      setLoading(false);
    } catch (error) {
      console.warn(error);
      alert("Error uploading post!");
      setLoading(false);
    }
    setTitle("");
    setText("");
    setRoute(null);
  };



  const handleRouteClick = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `/api/routes`,
      );
      setRoutes(response.data);
      setLoading(false);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween>
        <UserImage id={userId} image={picturePath} />
        <InputBase
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "0.7rem 2rem",
            marginLeft: "0.7rem",
          }}
        />
      </FlexBetween>
      <InputBase
        placeholder="Text"
        onChange={(e) => setText(e.target.value)}
        value={text}
        sx={{
          width: "100%",
          backgroundColor: palette.neutral.light,
          borderRadius: "1.5rem",
          padding: "1rem 2rem",
          marginTop: "1rem",
        }}
      />
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            <FormattedMessage id="mypost.imagen" defaultMessage="Image" />
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={handleRouteClick}>
          <AttachFileOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            <FormattedMessage id="mypost.route" defaultMessage="Route" />
          </Typography>
        </FlexBetween>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <List>
            {loading ? (
              <CircularProgress />
            ) : (
              routes.result &&
              routes.result.map((route) => (
                <Box>
                  <ListItem
                    key={route._id}
                    style={{ display: "flex", justifyContent: "space-around" }}
                    button
                    onClick={() => {
                      setRoute(route._id); // guarda la ruta seleccionada
                      setOpen(false); // cierra el dialogo
                    }}
                  >
                    <Box>
                      <Typography color={mediumMain}><FormattedMessage id="mypost.route" defaultMessage="Route" /> </Typography>
                      <ListItemText primary={route.title} />
                    </Box>
                    <Box>
                      <Typography color={mediumMain}><FormattedMessage id="mypost.seconds" defaultMessage="Seconds" /> </Typography>
                      <ListItemText primary={route.segons} />
                    </Box>
                    <Box>
                      <Typography color={mediumMain}><FormattedMessage id="mypost.mode" defaultMessage="Mode" /> </Typography>
                      <ListItemText primary={route.modalitat} />
                    </Box>
                  </ListItem>
                  <Divider sx={{ margin: "1.25rem 0" }} />
                </Box>
              ))
            )}
          </List>
        </Dialog>
        <Button
          disabled={!title}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "2rem",
          }}
        >
          <FormattedMessage id="mypost.publish" defaultMessage="Post" />
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
