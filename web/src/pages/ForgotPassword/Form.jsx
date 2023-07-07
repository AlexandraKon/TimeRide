import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


import { setLogin } from "../../redux/state";
import CustomDialog from "./CustomDialog";
import axios from "../../axios";

const registerSchema = yup.object().shape({
  mail: yup.string().email("Invalid email").required("Required"),
});

const initialValuesRegister = {
  mail: "",
};

const Form = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");


  const resetPass = async (values, onSubmitProps) => {
    try {
      console.log("values");
      console.log(values);
      const loggedInResponse = await axios.post(
        `/api/auth/forgot-password`,
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
        setRegisterMessage("Check your email!");
          setDialogMessage("We have sent you a link to change your password");
          setOpenDialog(true);
        setTimeout(() => {
          navigate("/home");
        }, 10000);
      }
    } catch (error) {

      console.error(error);
      setDialogMessage("Error sending email!");
      setRegisterMessage("Your email is wrong, try again!");
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
                    label="Email *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.mail}
                    name="mail"
                    error={Boolean(touched.mail) && Boolean(errors.mail)}
                    helperText={touched.mail && errors.mail}
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
