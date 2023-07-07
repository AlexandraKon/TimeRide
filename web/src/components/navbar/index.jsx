import { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { FormattedMessage } from "react-intl";
import { AdminPanelSettingsOutlined } from "@mui/icons-material";
import CustomDialog from "../../components/CustomDialog";
import { setMode, setLogout } from "../../redux/state";
import FlexBetween from "../styles/FlexBetween";
import styles from "./Header.module.css";
import logo from "../../assets/logo/logo.jpg";
import { langContext } from "../../context/LangProvider";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const lang = useContext(langContext);
  const { idUsuari } = useSelector((state) => state.user);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;

  const fullName = `${user.username}`;

  const navigate = useNavigate();

  const handleHelpClick = () => {
    navigate("/contact");
  };

  const adminPanel = () => {
    if (idUsuari == 1) {
      setDialogMessage("Inicio de sesión administración");
      setRegisterMessage("Welcome to TimeRide Admin!");
      setOpenDialog(true);
      navigate("/admin/posts");
    } else {
      setDialogMessage("Error al acceder al panel de admin");
      setRegisterMessage(
        "Tu usuario no tiene permisos para accedar al panel de admin"
      );
      setOpenDialog(true);
    }
  };

  return (
    <>
      <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt="TIMERIDE" />
        </Link>

        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            {/* <Message sx={{ fontSize: "25px" }} /> */}
            <AdminPanelSettingsOutlined
              onClick={adminPanel}
              sx={{ fontSize: "25px" }}
            />
            <Help sx={{ fontSize: "25px" }} onClick={handleHelpClick} />

            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                  <MenuItem onClick={() => dispatch(setLogout())}>
                    {" "}
                    <LogoutIcon />
                    <FormattedMessage id="nav.logout" defaultMessage="Log Out" />
                  </MenuItem>
                </Link>
              </Select>
            </FormControl>
            <Select
              value={lang.idioma} // Usa "lang" en lugar de "idioma.lenguaje"
              onChange={(e) => lang.establecerLenguaje(e.target.value)} // Usa setLang en lugar de idioma.setLanguage
              inputProps={{
                name: "idioma",
                id: "idioma-select",
              }}
              defaultValue={lang.idioma}
            >
              <MenuItem value="en-US">EN</MenuItem>
              <MenuItem value="es-MX">ES</MenuItem>
              <MenuItem value="ca-ES">CA</MenuItem>
            </Select>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )}

        {/* MOBILE NAV */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
          >
            {/* CLOSE ICON */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            {/* MENU ITEMS */}
            <FlexBetween
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="3rem"
            >
              <IconButton
                onClick={() => dispatch(setMode())}
                sx={{ fontSize: "25px" }}
              >
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </IconButton>
              <Message sx={{ fontSize: "25px" }} />
              <Notifications sx={{ fontSize: "25px" }} />
              <Help sx={{ fontSize: "25px" }} onClick={handleHelpClick} />

              <Select
                value={lang.idioma}
                onChange={(e) => lang.establecerLenguaje(e.target.value)}
                inputProps={{
                  name: "idioma",
                  id: "idioma-select",
                }}
                defaultValue={lang.idioma}
              >
                <MenuItem value="en-US">EN</MenuItem>
                <MenuItem value="es-MX">ES</MenuItem>
                <MenuItem value="ca-ES">CA</MenuItem>
              </Select>

              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                  <Link
                    to="/"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <MenuItem onClick={() => dispatch(setLogout())}>
                      <LogoutIcon />
                      <FormattedMessage
                        id="nav.logout"
                        defaultMessage="Perfil"
                      />
                    </MenuItem>
                  </Link>
                </Select>
              </FormControl>
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
      <CustomDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        message={dialogMessage}
        registerMessage={registerMessage}
      />
    </>
  );
};

export default Navbar;
