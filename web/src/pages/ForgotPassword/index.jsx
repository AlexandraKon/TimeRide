import { Link } from 'react-router-dom';
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

import styles from './Header.module.css';
import logo from '../../assets/logo/logo.jpg';


export const ForgotPassword = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Link  to="/">
              <img className={styles.logo} src={logo} alt="TIMERIDE" />
        </Link>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "2rem", textAlign: "center", fontSize: "18px" }}>
          Hello Dear User! <br/> Write your email to change the password:
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};