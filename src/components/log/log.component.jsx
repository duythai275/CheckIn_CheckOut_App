import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    actions: {
        padding: theme.spacing(2, 8)
    },
    button: {
        margin: theme.spacing(1),
        width: '150px'
    },
    virtualKeyboardContainer: {
      paddingTop: 20,
      display: 'flex'
    },
    virtualKeyboard: {
      margin: 'auto'
    },
    grid: {
      width: 220,
      height: 200
    }
}));

export default function FormDialog({open, handleClose, employee, logon}) {
  const classes = useStyles();

  const [passcode, setPasscode] = useState("");
  const [disable, setDisable] = useState(true);

  const handleCloseDialog = () => {
      setPasscode("");
      handleClose();
  }

  const checkin = () => {
    const d = new Date();
    logon("Checkin", d+"");
    setPasscode("");
    handleClose();
  }

  const checkout = () => {
    const d = new Date();
    logon("Checkout", d+"");
    setPasscode("");
    handleClose();
  }

  const keyboard = k => {
    if ( k === "Clr" ) setPasscode("");
    else if ( k === "Del" ) setPasscode(passcode.slice(0,passcode.length - 1));
    else setPasscode(`${passcode}${k}`);
  }

  useEffect( () => {
    ( passcode === ""+employee.Code ) ? setDisable(false) : setDisable(true)
  }, [passcode, employee.Code])

  return (
      <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{employee.Name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To check in/out, please enter your pass code here.
          </DialogContentText>
          <TextField
            margin="dense"
            id="code"
            label="Enter Passcode"
            type="password"
            value={passcode}
            onChange = { event => setPasscode(event.target.value)}
            fullWidth
          />
          <div className={classes.virtualKeyboardContainer}>
            <div className={classes.virtualKeyboard}>
              <Grid container spacing={1} className={classes.grid}>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("1")}>1</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("2")}>2</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("3")}>3</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("4")}>4</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("5")}>5</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("6")}>6</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("7")}>7</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("8")}>8</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("9")}>9</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("Clr")}>Clr</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("0")}>0</Button></Grid>
                <Grid item xs={4}><Button variant="outlined" onClick={() => keyboard("Del")}>&#60;</Button></Grid>
              </Grid>
            </div>
          </div>
          <div className={classes.actions}>
            <Button variant="contained" color="primary" disabled={disable} className={classes.button} onClick={checkin}>
                Check In
            </Button>
            <Button variant="contained" color="primary" disabled={disable} className={classes.button} onClick={checkout}>
                Check Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
}