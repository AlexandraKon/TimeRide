import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root': {
      borderRadius: 12,
      boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.05)',
    },
  },
  title: {
    fontWeight: 700,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
}));

function CustomDialog({ open, onClose, message, registerMessage }) {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog}>
      <DialogContent>
        <Typography className={classes.message}>{registerMessage}</Typography>
      </DialogContent>
      <DialogTitle disableTypography className={classes.title}>
        <Typography>{message}</Typography>
      </DialogTitle>
    </Dialog>
  );
}

export default CustomDialog;
