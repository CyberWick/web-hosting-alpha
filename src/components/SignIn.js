import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Dropzone from 'react-dropzone';
import { Input } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [privKey, setPrivKey] = useState('');
  const [file, setFile] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

    const onChangeHandler = (event) => {
        setPrivKey(event.target.value);
    }

    const onSetFile = (file) => {
        console.log('FILE: ', file[0]);
        var reader = new FileReader();
        try{
            reader.addEventListener("loadend", (event) => { 
                console.log('CONTENT: ',event.target.result);
                setFile(file[0]);
                setPrivKey(event.target.result);
            });
            const content = reader.readAsText(file[0]);
            // console.log('CONTENT: ', content);
        } catch (err) {
            alert('File reading went wrong, File maybe corrupt...Try Again!');
        }
    }

    const onSubmitHandler = () => {
        if( privKey === '') {
            alert('Enter file or private key to login!')
        } else {
            props.onCheckLogin(privKey, rememberMe);
        }
    }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Private Key"
            value={privKey}
            autoFocus
            onChange={(e) => onChangeHandler(e)}
          />
        <Dropzone onDrop={onSetFile}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} type='file'/>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                readOnly
                label={file ? '' : 'Upload Private Key File'}
                value={privKey}
                autoComplete="current-password"
            />
          </div>
        )}
      </Dropzone>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            onChange={() => {
                setRememberMe(prev => !prev)
            }}
            value={rememberMe}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onSubmitHandler}
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link onClick={props.onToggle} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* <Box mt={8}>
        <Copyright />
      </Box> */}
    </Container>
  );
}