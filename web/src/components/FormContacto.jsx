import React, { useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import emailjs from "emailjs-com";
import { Dialog } from "@material-ui/core";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

const registerSchema = yup.object().shape({
  user_name: yup
    .string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\s_-]+$/, "Nombre de usuario inválido"),
  user_email: yup
    .string()
    .email("Correo electrónico inválido")
    .required("Este campo es obligatorio"),
  message: yup.string().required("Este campo es obligatorio"),
});

export default function FormContacto() {
  const [openDialog, setOpenDialog] = useState(false);

  const enviarEmail = (values, actions) => {
    emailjs
      .send("service_2hzzidj", "template_hnn7snd", values, "TXu2xEFB-EF9PPoCG")
      .then((res) => {
        console.log(res);
        actions.setSubmitting(false);
        setOpenDialog(true); // abrir diálogo de confirmación
        actions.resetForm(); // borrar valores del formulario
      })
      .catch((error) => {
        console.log(error);
        actions.setSubmitting(false);
      });
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Formik
        initialValues={{ user_name: "", user_email: "", message: "" }}
        validationSchema={registerSchema}
        onSubmit={(values, actions) => {
          enviarEmail(values, actions);
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="user_name"
                  name="user_name"
                  label={<FormattedMessage id="contact.name" defaultMessage="Name" />}
                  variant="outlined"
                  value={values.user_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.user_name && Boolean(errors.user_name)}
                  helperText={touched.user_name && errors.user_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="user_email"
                  name="user_email"
                  label={<FormattedMessage id="contact.email" defaultMessage="Email" />}
                  variant="outlined"
                  value={values.user_email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.user_email && Boolean(errors.user_email)}
                  helperText={touched.user_email && errors.user_email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="message"
                  name="message"
                  label={<FormattedMessage id="contact.message" defaultMessage="Message" />}
                  variant="outlined"
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.message && Boolean(errors.message)}
                  helperText={touched.message && errors.message}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    width: "50%",
                    margin: "0 auto",
                    marginTop: "20px",
                    "&.disabled": {
                      backgroundColor: "#ccc",
                      color: "#666",
                    },
                  }}
                  disabled={
                    values.user_name === "" ||
                    values.user_email === "" ||
                    values.message === "" ||
                    errors.user_name ||
                    errors.user_email ||
                    errors.message
                  }
                >
                  <FormattedMessage id="contact.send" defaultMessage="Send Email" />
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <Box sx={{ p: 2 }}>
    <Typography variant="h5" sx={{ mb: 2 }}>
      ¡Correo enviado!
    </Typography>
    <Typography variant="body1">
      Su mensaje ha sido enviado correctamente. Gracias por contactarnos.
    </Typography>
  </Box>
</Dialog>
    </Box>
  );
}
