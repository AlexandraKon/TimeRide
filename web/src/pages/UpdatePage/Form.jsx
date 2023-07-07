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
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogTitle, Grid } from "@material-ui/core";

import CustomDialog from "../../components/CustomDialog";
import axios from "../../axios";

const registerSchema = yup.object().shape({
  name: yup.string(),
  city: yup.string(),
  occupation: yup.string(),
});

const initialValuesRegister = {
  name: "",
  city: "",
  occupation: "",
};

const Form = () => {
  // const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { idUsuari } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const register = async (values, onSubmitProps) => {
    try {
      console.log(values);
      const response = await axios.put(`/api/users/${idUsuari}`, values);
      console.log(response);
      const { data } = response;
      onSubmitProps.resetForm();

      if (data) {
        setDialogMessage("The data has been changed successfully!");
        setRegisterMessage("Thanks!!!");
        setOpenDialog(true);
      }
    } catch (error) {
      console.error(error);
      setDialogMessage("Failed to change data");
      setRegisterMessage("Try again!");
      setOpenDialog(true);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    register(values, onSubmitProps);
  };

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

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return randomNumber.toString().padStart(6, "0");
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
                Change profile picture
              </Button>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              
              <TextField
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="name"
                error={Boolean(touched.name) && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="City"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.city}
                name="city"
                error={Boolean(touched.city) && Boolean(errors.city)}
                helperText={touched.city && errors.city}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Occupation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name="occupation"
                error={
                  Boolean(touched.occupation) && Boolean(errors.occupation)
                }
                helperText={touched.occupation && errors.occupation}
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select a profile picture</DialogTitle>
        <Grid container spacing={2} justify="center" alignItems="center">
          {[...Array(18)].map((_, i) => (
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
    </>
  );
};

export default Form;
