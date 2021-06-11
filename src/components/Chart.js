import React, {useState} from 'react';
import Title from './Title';
import {CloudUpload, Delete, Dns, Folder, Language, Share} from '@material-ui/icons';
import { Button, Grid, Link, Typography, Menu, MenuItem } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { globalUsersThreadID } from "../constants/RegisteredUsers"
import ThreadID from '@textile/threads-id';
import { useDispatch, useSelector } from 'react-redux';

const styles = makeStyles((theme) => ({
  dropZone: {
    textAlign: 'center',
    backgroundColor: '#FFD700',
    color: '#bdbdbd',
    borderRadius: 5,
  },
  link: {
    display: 'flex',
    marginBottom: 5,
    marginLeft: 15,
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 30,
    height: 30,
  },
}));

const Chart = (props) => {
  const dispatch = useDispatch()
  const classes = styles();
  const [collabDialog, setCollabDialog] = React.useState(false)
  const [collabRole, setCollabRole] = useState('')
  const [toggleRoleMenu, setToggleRoleMenu] = useState(null)
  const globaltid = ThreadID.fromString(globalUsersThreadID)
  const [emailid, setEmailid] = useState('')
  const client = useSelector(state => state.user_data.client);
  // console.log('CHARTS Props', props);
  const handleCollaborator = () => {
      setCollabDialog(true)
  }

  const handleShare = async() => {
      console.log("EMAIL ID ", emailid)
      console.log("COLLAB ROLE ", collabRole)
      try {
      const result = await client.findByID(globaltid,'RegisteredUsers',emailid)
      console.log('PUB KEY', result.publicKey)
      props.onShare(result.publicKey, emailid, collabRole)
      } catch(err) {
        alert(emailid+' doesn\'t exist!');
      }
      setEmailid('')
      setCollabDialog(false)
  }

  const handleOpenRoleMenu = (event) => {
    setToggleRoleMenu(event.currentTarget)
  }

  const handleCloseRoleMenu = () => {
    setToggleRoleMenu(null)
  }

  const onChangeemail = (event) => {
    setEmailid(event.target.value)
  }

  return (
    <React.Fragment>
      <Title>{props.bucket.name}</Title>
      <Grid container direction='row' style={{height: 150}}>
          <Grid item container xs={12} sm={9} 
          // style={{backgroundColor: 'red'}}
          justify='flex-start'
          alignItems='flex-start'
          direction='column'>
            <Grid item style={{marginBottom: 10}}>
              <Typography>LINKS:</Typography>
            </Grid>
            <Grid item>
              <Link 
                onClick={() => {
                  window.open(props.links.www, '_blank').focus();
                }}
                component='button'
                variant='button'
                color='secondary'
                style={{fontSize: 20}}  
                className={classes.link}>
                <Language className={classes.icon} />
                WWW (Website Link)
              </Link>
              </Grid>
              <Grid item>
              <Link
                color="inherit"
                onClick={() => {
                  window.open(props.links.ipns, '_blank').focus();
                }}
                component='button'
                variant='button'
                style={{fontSize: 20}} 
                className={classes.link}
              >
                <Dns className={classes.icon} />
                IPNS   (IPFS Namespace)
              </Link>
              </Grid>
              <Grid item>
              <Link
                component='button'
                variant='button'
                style={{fontSize: 20}} 
                onClick={() => {
                  window.open(props.links.url, '_blank').focus();
                }}
                className={classes.link}
              >
                <Folder className={classes.icon} />
                URL (BUCKET Link)
              </Link>
            </Grid>
          </Grid>
          <Grid 
            item container xs={12} sm={3} 
            // style={{backgroundColor: '}} 
            direction='column'
            justify='center'
            alignItems='center'
            spacing={1}>
              <Grid item container justify='flex-start'>
                <Typography>OPERATIONS:</Typography>
              </Grid>
            <Grid item>
            <Button 
              variant="contained"
              color="secondary"
              onClick={props.onDelete}
              startIcon={<Delete />}
              >
              DELETE SITE
            </Button>
            </Grid>
            <Grid item>
              <Dropzone 
                onDrop={props.onUpdate}
                maxSize={20000000}
                multiple={true}
                >
                {({getRootProps, getInputProps}) => (
                  
                  <div className={classes.dropZone} {...getRootProps()}>
                    <input {...getInputProps()} directory="" webkitdirectory="" type="file"  />
                    <Button
                      variant="contained"
                      color="default"
                      // className={classes.button}
                      startIcon={<CloudUpload />}
                    >
                      UPDATE SITE
                    </Button>
                  </div>
                )}
              </Dropzone>
            </Grid>
            <Grid item>
            <Button 
              variant="contained"
              color="primary"
              onClick={handleCollaborator}
              startIcon={<Share />}
              >
              SHARE SITE
            </Button>
            </Grid>
          </Grid>
      </Grid>
      <div>
      <Dialog open={collabDialog} onClose={handleShare} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Collaborator</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={emailid}
            onChange={(e) => {onChangeemail(e)}}
          />

        <Button variant="contained" color="default" onClick={handleOpenRoleMenu}>
          Select role
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={toggleRoleMenu}
          keepMounted
          open={Boolean(toggleRoleMenu)}
          onClose={handleCloseRoleMenu}>
          <MenuItem onClick={() => {
            setCollabRole('Reader')
            handleCloseRoleMenu()
          }}>Read</MenuItem>
          <MenuItem onClick={() => {
            setCollabRole('Writer')
            handleCloseRoleMenu()
          }}>Write</MenuItem>
          <MenuItem onClick={() => {
            setCollabRole('Admin')
            handleCloseRoleMenu()
          }}>Admin</MenuItem>          
        </Menu>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setCollabDialog(false)} color="primary">
            Cancel
          </Button>
          <Button variant='contained' color='primary' onClick={handleShare} color="primary">
            Share
          </Button>
        </DialogActions>
      </Dialog>
      </div>
           </React.Fragment>
  );
}

export default Chart