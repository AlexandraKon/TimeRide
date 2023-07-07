import Navbar from "../../components/navbar";
import Form from "./Form";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

export const UpdatePage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Navbar/>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem", textAlign: "center" }}>
        Profile settings:
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};