import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NotFoundImg from "../../assets/notfound/NotFound.png";
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
  } from "@mui/material";


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
  },
  
  image: {
    width: '50%',
    height: 'auto',
  },
}));

export const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Typography variant="h1" className={classes.text}>
        That's odd
      </Typography>
      <Typography variant="p" className={classes.text}>
        This page appears to be missing.
      </Typography>
      <div >
        <img src={NotFoundImg} alt="Not Found" />
      </div>
      
    </div>
  );
}