import React from 'react';
import Title from './Title';
import {CloudUpload, Delete, Dns, Folder, Language} from '@material-ui/icons';
import { Button, Grid, Link, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';

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

export default function Chart(props) {
  const classes = styles();
  // console.log('CHARTS Props', props);
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
            {/* <Grid item>
            <Dropzone onDrop={props.onModify}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} type='file'/>
                <Button 
                  variant="contained"
                  color='primary'
                  startIcon={<Delete />}>
                  MODIFY SITE
                </Button>
              </div>
              )}
            </Dropzone>
            </Grid> */}
          </Grid>
      </Grid>
           </React.Fragment>
  );
}