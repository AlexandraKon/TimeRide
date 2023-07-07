import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../redux/state";
import CustomDialog from "../../components/CustomDialog";

import axios from "../../axios";

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(5, "More than 5 characters")
    .required("required")
    .matches(/^[a-zA-Z0-9_-]+$/, "Invalid username"),
  mail: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Required"),
  name: yup.string().required("Required"),
});

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("Required")
    .matches(/^[a-zA-Z0-9_-]+$/, "Invalid username"),
  password: yup.string().required("Required"),
});

const initialValuesRegister = {
  username: "",
  mail: "",
  password: "",
  name: "",
  confirmPassword: "",
};

const initialValuesLogin = {
  username: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const register = async (values, onSubmitProps) => {
    try {
      const response = await axios.post("/api/auth/register", values);
      console.log(response);
      const { data } = response;
      onSubmitProps.resetForm();

      if (data) {
        setDialogMessage("Registro creado correctamente");
        setRegisterMessage("Gracias por registrarte!!!");
        setOpenDialog(true);
        setPageType("login");
      }
    } catch (error) {
      console.error(error);
      setDialogMessage("Error al crear registro");
      setRegisterMessage("Prueba de nuevo rellenar el registro!!!");
      setOpenDialog(true);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      console.log(values);
      const loggedInResponse = await axios.post("/api/auth/login", values);
      console.log(loggedInResponse);
      const loggedIn = loggedInResponse.data;
      onSubmitProps.resetForm();

      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn,
            token: loggedIn.token,
          })
        );
        setDialogMessage("Inicio de sesión exitoso");
        setRegisterMessage("Welcome to TimeRide!");
        setOpenDialog(true);
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      setDialogMessage("Error al iniciar sesión");
      setRegisterMessage("Username or password incorrect!");
      setOpenDialog(true);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const googleLogin = () => {
    window.open("http://localhost:4444/api/auth/google", "_self");
  };

  return (
    <>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                label="Username *"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={Boolean(touched.username) && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Password *"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              {isLogin && (
                <Typography
                  onClick={() => {
                    navigate("/reset-password");
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  FORGOT PASSWORD ?
                </Typography>
              )}
              {isRegister && (
                <>
                  <TextField
                    label="Confirm Password *"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    // value={values.confirmPassword}
                    name="confirmPassword"
                    error={
                      Boolean(touched.confirmPassword) &&
                      Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Email *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.mail}
                    name="mail"
                    error={Boolean(touched.mail) && Boolean(errors.mail)}
                    helperText={touched.mail && errors.mail}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Name *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={Boolean(touched.name) && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    sx={{ gridColumn: "span 2" }}
                  />
                </>
              )}
            </Box>
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  m: "1rem 0",
                  p: "1rem",
                  backgroundColor: palette.background.alt,
                  color: palette.primary.main,
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Button>
              <div>
                <div onClick={googleLogin}>
                  <p>Login with Google</p>
                </div>
              </div>
            </Box>
          </form>
        )}
      </Formik>
      <CustomDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        message={dialogMessage}
        registerMessage={registerMessage}
      />
    </>
  );
};

export default Form;
