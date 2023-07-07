import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "components/navbar";
import UserWidget from "components/widgets/UserWidget";
import FormContacto from "../../components/FormContacto";

export const ContactPage = () => {
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
          <FormContacto />
        </Box>
      </Box>
    </Box>
  );
};
