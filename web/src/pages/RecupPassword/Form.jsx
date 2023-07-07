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
import { useParams } from "react-router-dom";


import { setLogin } from "../../redux/state";
import CustomDialog from "../../components/CustomDialog";
import axios from "../../axios";

const registerSchema = yup.object().shape({
  password: yup.string().required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Required"),
});

const initialValuesRegister = {
  password: "",
  // confirmPassword: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const { id } = useParams();
  const { token } = useParams();

  const resetPass = async (values, onSubmitProps) => {

    try {
      const loggedInResponse = await axios.post(
        `/api/auth/reset-password/${id}/${token}`,
        values
      );
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
      setDialogMessage("Error al cambiar contraseña");
      setRegisterMessage("Intenta otra vez!");
      setOpenDialog(true);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    resetPass(values, onSubmitProps);
  };

  return (
    <>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesRegister}
        validationSchema={registerSchema}
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
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
              />
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
                SEND
              </Button>
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
