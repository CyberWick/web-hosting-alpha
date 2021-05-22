import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import { mainListItems, secondaryListItems } from '../components/ListItems';
import Chart from '../components/Chart';
import Deposits from '../components/Deposits';
import Orders from '../components/Orders';
import { Users } from '@spacehq/users';
import { ThreadID } from '@textile/hub';
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { AccountCircle } from '@material-ui/icons';

const users = new Users({ endpoint: 'wss://auth.space.storage' });

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

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  loadContainer: {
    marginTop: window.innerHeight/2,
    marginLeft: (window.innerWidth-240)/2,
  }
}));


export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const buckets = useSelector(state => state.user_data.buckets); 
  const client = useSelector(state => state.user_data.client);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState(null);
  const [dbInfo, setDBInfo] = useState(null);
  const [currBucket, setCurrBucket] = useState(-1);
  const [listBucket, setListBucket] = useState([]);
  const [totalFiles, setTotalFiles] = useState(-1);
  const [operation, setOperation] = useState('');


  useEffect(() => {
    console.log('Running useEffect');
    onLoadUser();
  }, []);

  const onLoadUser = async() => {
    setLoading(true);
    // const firstBucket = await buckets.getOrCreate('personal');
    const listBuckets = await buckets.existing();
    console.log('LIST: ', listBuckets);
    if(listBuckets.length > 0) {
      await onLoadBucket(listBuckets[0], 0);
      setListBucket(prev => prev.concat(listBuckets));
    }
    // setCurrBucket(0);
    setLoading(false);
  }

  // TODO: Use this func on bucket change... pass bucket root and index

  const onLoadBucket = async(bucketRoot, index) => {
      await buckets.getOrCreate(bucketRoot.name);
      setCurrBucket(index);
      const inLinks = await buckets.links(bucketRoot.key);
      console.log('CLIENT', client);
      const genThread = ThreadID.fromString(bucketRoot.thread);
      const DBInfo = await client.getDBInfo(genThread);
      setDBInfo(DBInfo);
      setLinks(inLinks);
  }

  const onDeleteBucket = async() => {
    console.log('DELETING BUCKET', listBucket[currBucket]);
    let listLength = listBucket.length;
    if(currBucket === -1) {
      return alert('No active bucket selected');
    } else {
      setLoading(true);
      const result = await buckets.remove(listBucket[currBucket].key);
      setListBucket(prev => {
        console.log('BEFORE SPLICE', prev);
        const modPrev = prev.splice(currBucket, 1);
        console.log('SPLICE LIST BUCKETS', modPrev);
        return modPrev;
      })
      listLength = listLength - 1;
      if(listLength >= 1) {
        setCurrBucket(0);
      } else {
        setCurrBucket(-1);
      }
      console.log('CURRBUCKET', currBucket, listLength);
      setLoading(false);
      return alert('Bucket deleted');
    }
  }

  const onUpdateVersion = async(files) => {
    console.log('UPDATING BUCKET', listBucket[currBucket], files);
    let listLength = listBucket.length;
    if(currBucket === -1) {
      return alert('No bucket Selected to update!... Something went wrong!');
    } else {
      setLoading(true);
      const pullPath = await buckets.listPath(listBucket[currBucket].key, '/');
      let delFiles = pullPath.item.items;
      delFiles.splice(0,1);
      console.log('FILES TO BE DELETED: ', delFiles);
      setTotalFiles(delFiles.length);
      setOperation('Deleting directories');
      for (const file of delFiles) {
        const removePath = await buckets.removePath(listBucket[currBucket].key, '/'+file.name).catch(err => console.log('REMIVE PATHJ ERROR: ', err));
        console.log('CLEARED BUCKET', removePath);
      }
      setOperation('Uploading files')
      setTotalFiles(files.length);
      for (const file of files) {
        const name = file.name;
        const num = file.path.indexOf("/");
        const file_info = {content: file.stream(), mimeType: file.type};
        const pushFile = await buckets.pushPath(listBucket[currBucket].key, file.path.substr(num+1), file_info);
        console.log('PUSHFILE: ', pushFile);
        setTotalFiles(prev => (prev-1));
        //TODO: Clear all the previous files and overwrite the new added files.
      }
      setTotalFiles(-1);
      // setOperation('');
      setLoading(false);
    }
  }

  const onModifyBucket = async(files) => {
    console.log('MODIFYING BUCKET', listBucket[currBucket], files);
    let listLength = listBucket.length;
    if(currBucket === -1) {
      return alert('No bucket Selected to update!... Something went wrong!');
    } else {
      setLoading(true);
      setOperation('Uploading files')
      setTotalFiles(files.length);
      for(const file of files) {
        console.log('FILE: ', file);
        const pushFile = await buckets.pushPath(listBucket[currBucket].key, file.name, file.stream());
        console.log('PUSH FILE', pushFile);
      }
      setTotalFiles(-1);
      setLoading(false);
    }
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  let screen = (<div className={classes.loadContainer}>
                    <CircularProgress size={30}/>
                    {totalFiles === -1 ? <h3>Loading...</h3>: <h3 style={{marginLeft: -45,}}>{operation} {' (Remaining) : '} {totalFiles} </h3>}
                </div>)
  if(listBucket.length === 0 && !loading) {
    screen = (
      <div className={classes.loadContainer}>
        <h3>No Bucket created... Add from side Bar</h3>
      </div>
    )
  }
  if(!loading && listBucket.length >= 1) {
      console.log('LIST BUCKETS', listBucket[currBucket]);
      screen = (
        <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart 
                  bucket={listBucket[currBucket]}
                  links={links}
                  onDelete={onDeleteBucket}
                  onUpdate={onUpdateVersion}
                  onModify={onModifyBucket}/>
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits dbInfo={dbInfo}/>
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Orders />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main> 
      )
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
              <AccountCircle fontSize='large'/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
      {screen}
    </div>
  );
}