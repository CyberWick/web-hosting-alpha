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
import Chart from '../components/Chart';
import Deposits from '../components/Deposits';
import Orders from '../components/Orders';
import { PrivateKey, PublicKey, ThreadID } from '@textile/hub';
import { CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { AccountCircle } from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Query } from '@textile/hub'
import BucketsList from '../components/ListBuckets';
import Title from '../components/Title'
import Backdrop from '@material-ui/core/Backdrop';
import NewBucket from '../components/newBucket.js';
import ListSharedBuckets from '../components/ListSharedBuckets.js';
// import CircularProgress from '@material-ui/core/CircularProgress';
import { reactLocalStorage } from 'reactjs-localstorage';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        G20
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
    padding: '0px 8px',
    
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
    marginTop: window.innerHeight,
    marginLeft: (window.innerWidth-240)/2,
    // textAlign: 'center',
    height : '100%'
  },
  loadEmptyContainer: {
    marginTop: (window.innerHeight)/2,
   // marginLeft: (window.innerWidth-240)/2,
   textAlign: 'center',
    height : '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    textAlign:'center'
  },
  bucketListStyle : {
		"overflowY": 'auto',
		maxHeight: '70%',

	},
  hideList: {
    display: 'none'
  },
  allListDrawer:{
    height: '70%',
  }
}));


export default function Dashboard(props) {
  var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  const dispatch = useDispatch()
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const spaceUser = useSelector(state => state.user_data.spaceUser); 
  const textileUser = useSelector(state => state.user_data.textileUser);
  const buckets = useSelector(state => state.user_data.buckets); 
  const client = useSelector(state => state.user_data.client);
  const user_profile = useSelector(state => state.user_data.user_details)
  const threadID = useSelector(state => state.user_data.threadID)
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState(null);
  const [dbInfo, setDBInfo] = useState(null);
  const [currBucket, setCurrBucket] = useState(-1);
  const [listBucket, setListBucket] = useState([]);
  const [totalFiles, setTotalFiles] = useState(-1);
  const [operation, setOperation] = useState('');
  const [selectedBucket, setSelectedBucket] = useState('')
  const [new_fname,setfname] = useState(user_profile.fname)
  const [new_lname, setlname] = useState(user_profile.lname)
  const [new_email,setemail] = useState(user_profile.emailid)
  const [sharedListBucket, setSharedListBucket] = useState([]);
  const [isSharedSelected, setIsSharedSeleted] = useState(false);
  const [currSharedBucket, setCurrSharedBucket] = useState(-1);
  const [explore, setExplore] = useState("");

  const watchCallback = async (reply, err) => {
    if (!reply || !reply.message) return console.log('no message')

    setLoading(true);

    const bodyBytes = await spaceUser.identity.decrypt(reply.message.body)    
    const decoder = new TextDecoder()
    const body = decoder.decode(bodyBytes)

    const jsonObject = JSON.parse(body.toString());
    console.log('Just String: ', body.toString());
    console.log('JSON object: ', jsonObject);

    await client.create(threadID, 'shared', [jsonObject])
    
    await textileUser.deleteInboxMessage(reply.message.id)
      .catch(err => console.log('Error while deleting message: ', err));

    refreshSharedBuckets();

    setLoading(false);

  }

  const onShareBucket = async(pubKey, email, role) => {
    console.log('SHARING BUCKET');//, listBucket[currBucket]);
    if(currBucket === -1) {
      return alert('No active bucket selected');
    } else {
      console.log('ADDING ', pubKey, ' as ', role);
      const accessRole = ['N/A', 'Reader', 'Writer', 'Admin'];
      const roleID = accessRole.findIndex(item => item === role);
      if(roleID === -1) {
        return alert('Undefined role');
      }
      const roles = new Map();
      roles.set(pubKey, 3);
      await buckets.pushPathAccessRoles(listBucket[currBucket].key, '', roles);
      const shareJSON = {
        type: 'SITE_SHARED',
        _id: listBucket[currBucket].key,
        bucketRoot: listBucket[currBucket],
      }
      const shareMessage = JSON.stringify(shareJSON);
      const encoder = new TextEncoder();
      const shareBody = encoder.encode(shareMessage);
      const pk = reactLocalStorage.get('privKey');
      
      await textileUser.sendMessage(PrivateKey.fromString(pk), PublicKey.fromString(pubKey), shareBody).catch(err => console.log('COULDNT SEND MESSAGE', err));
      }
    }
  
  const watchInbox = async() => {
    const mailboxID = await textileUser.getMailboxID();
    console.log('Mailbox created for user..');
    const resp = await textileUser.watchInbox(mailboxID, watchCallback);
    console.log(resp);
  }

  useEffect(() => {
    console.log('Running useEffect');
    watchInbox();    
    onLoadUser();
  }, []);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const onFnameChange = (event) => {
    setfname(event.target.value)
  }

  const onLnameChange = (event) => {
    setlname(event.target.value)
  }

  const onEmailChange = (event) => {
    setemail(event.target.value)
  }

  const handleSave = async() => {
 
    if(!pattern.test(new_email))
    {
        alert('Wrong id')
        setemail(user_profile.emailid)
    }

    else{
      const query = new Query().orderByID()
      const result = await client.find(threadID, 'userProfile', query);
      const new_user = result[0]
      new_user.fname = new_fname
      new_user.lname = new_lname
      new_user.emailid = new_email
      new_user._id = new_email
      await client.save(threadID, 'userProfile', [new_user])
      const result1 = await client.find(threadID, 'userProfile', query);
      console.log('new results', result1);

      setDialogOpen(false);
    }
  };


  const loadInboxRequests = async() => {
    const inboxResp = await textileUser.listInboxMessages();
    // console.log('Inbox of user2: ', inboxResp);

    const sharedEntriesToBeLoaded = [];

    for(const element of inboxResp){
        // Check signature
        const msgBody = element.body
        // const sig = element.signature
        // const verify = await id.public.verify(msgBody, sig)
        // console.log('Verificaion: ', verify);

        // Check body
        const bodyBytes = await spaceUser.identity.decrypt(msgBody)
        const decoder = new TextDecoder()
        const body = decoder.decode(bodyBytes)
        
        const jsonObject = JSON.parse(body.toString());
        console.log('Just String: ', body.toString());
        console.log('JSON object: ', jsonObject);

        sharedEntriesToBeLoaded.push(jsonObject);
        console.log('New shared entry created: ', jsonObject.threadID);


        await textileUser.deleteInboxMessage(element.id)
          .catch(err => console.log('Error ala rao: ', err));

    }

    if(sharedEntriesToBeLoaded.length!=0){
      await client.create(threadID, 'shared', sharedEntriesToBeLoaded);
    }
    console.log('Done brooo..');
  }

  const refreshSharedBuckets = async() => {

    const sharedEntriesOnThread = await client.find(threadID, 'shared', {});
    console.log('All shared buckets present in the collection: ', sharedEntriesOnThread);

    const tempList = []
    for(const bucketObjet of sharedEntriesOnThread){
      tempList.push(bucketObjet.bucketRoot);
    }
    setSharedListBucket(tempList);


    // TODO: 
    // Assign or return the sharedEntriesOnThread..
    // Line 535: isSharedSeleted
    // Orders- withThread()
    //       - delete button

    
  }


  const onLoadUser = async() => {
    setLoading(true);

    // TODO: Add Fetch for shared buckets
    await loadInboxRequests();
    await refreshSharedBuckets();


    const listBuckets = await buckets.existing();
    console.log('LIST: ', listBuckets);
    if(listBuckets.length > 0) {
      await onLoadBucket(listBuckets[0], 0);
      setListBucket(prev => prev.concat(listBuckets));
    }

    // setCurrBucket(0);
    setLoading(false);
  }

  const onLoadBucket = async(bucketRoot, index, isShared=false) => {
      console.log('Before with..');
      const id = threadID.toString();
      await buckets.withThread(bucketRoot.thread);
      console.log('After with..', id);
      if(isShared){
        console.log('Loading shared bucket');
        setCurrSharedBucket(index);
      }else{
        console.log('Loading user bucket');
        setCurrBucket(index);
      }
      // await buckets.getOrCreate(bucketRoot.name);
      const inLinks = await buckets.links(bucketRoot.key);
      console.log("links", inLinks);
      console.log('CLIENT', client);
      const genThread = ThreadID.fromString(bucketRoot.thread);
      // ThreadID.
      const DBInfo = await client.getDBInfo(genThread);
      setExplore(bucketRoot.path)
      console.log("explore", explore)
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
      const newBuckList = await buckets.existing()
      
      setListBucket(newBuckList)
      listLength = listLength - 1;
      if(listLength >= 1) {
        await onLoadBucket(listBucket[0], 0);
      } else {
        setCurrBucket(-1);
      }
      console.log('CURRBUCKET', currBucket, listLength);
      // console.log
      setLoading(false);
      return alert('Bucket deleted');
    }
  }

  const onUpdateVersion = async(files) => {
    console.log('UPDATING BUCKET', listBucket[currBucket], files);
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
        const num = file.path.indexOf("/");
        const file_info = {content: file.stream(), mimeType: file.type};
        const pushFile = await buckets.pushPath(listBucket[currBucket].key, file.path.substr(num+1), file_info);
        console.log('PUSHFILE: ', pushFile);
        setTotalFiles(prev => (prev-1));
        //TODO: Clear all the previous files and overwrite the new added files.
      }
      const root = await buckets.root(listBucket[currBucket].key)
      setExplore(root.path)
      setTotalFiles(-1);
      setOperation('');
      
      setLoading(false);
    }
  }

  const onModifyBucket = async(files) => {
    console.log('MODIFYING BUCKET', listBucket[currBucket], files);
    if(currBucket === -1) {
      return alert('No bucket Selected to update!... Something went wrong!');
    } else {
      setLoading(true);
      setOperation('Uploading files')
      setTotalFiles(files.length);
      const tempStr = 'HEllo PS!';
      const encoder = new TextEncoder();

      const data = Buffer.from(btoa(tempStr), 'base64');
      // for(const file of files) {
      //   console.log('FILE: ', file);
        const pushFile = await buckets.pushPath(listBucket[currBucket].key, 'PS.txt', data);
        console.log('PUSH FILE', pushFile);
      // }
      setTotalFiles(-1);
      setLoading(false);
    }
  }

  const changeListTypeHelper = async(newIsSharedSelected)=>{
    if(isSharedSelected === newIsSharedSelected){
      return;
    }
    setLoading(true)
    setIsSharedSeleted(newIsSharedSelected);
    if (newIsSharedSelected){
        if(sharedListBucket.length>=1){
          await onLoadBucket(sharedListBucket[0], 0, true);
        } else {
          setCurrSharedBucket(-1);
        }
    }
    else{
      if(listBucket.length >= 1) {
        await onLoadBucket(listBucket[0], 0);
      } else {
        setCurrBucket(-1);
      }
    }
   
    setLoading(false)
  }
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  let screen = (<div className={classes.loadContainer}>
                    <Backdrop className={classes.backdrop} open={loading} >
                            <CircularProgress color="inherit" />
                            
                        </Backdrop>
                        <div>
                            {totalFiles === -1 ? <h3 style={{marginLeft: -150,marginTop: -300,}} >Loading...</h3>: <h3 style={{marginTop: -300,marginLeft: -200,}}>{operation} {' (Remaining) : '} {totalFiles} </h3>}
                          </div>
                   
                </div>)
  if(((isSharedSelected===false && listBucket.length === 0) || (isSharedSelected && sharedListBucket.length===0)) && !loading) {
    screen = (
      <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
      <div className={classes.loadEmptyContainer}>
        <h3>No Buckets available... Add from side bar or ask friends to share</h3>
      </div>
      </Container>
      </main> 
    )
  }
  if(!loading && ((isSharedSelected===false && listBucket.length >=1) || (isSharedSelected && sharedListBucket.length>=1))){
      // console.log('LIST BUCKETS', listBucket[currBucket]);
      screen = (
        <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart 
                  isSharedSelected={isSharedSelected}
                  bucket={isSharedSelected===false? listBucket[currBucket] : sharedListBucket[currSharedBucket]}
                  links={links}
                  explore={explore}
                  onDelete={onDeleteBucket}
                  onUpdate={onUpdateVersion}
                  onShare={onShareBucket}
                  // onModify={onModifyBucket}
                  />
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
              <Orders bucketKey = {isSharedSelected===false? listBucket[currBucket].key  : sharedListBucket[currSharedBucket].key} buckets = {buckets} setExplore={setExplore}/>
              </Paper>
            </Grid>
          </Grid>
          {/* <Box pt={4}>
            <Copyright />
          </Box> */}
        </Container>
      </main> 
      )
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
       
        <Toolbar className={classes.toolbar}>
          {/* <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton> */}
          
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleClickOpen}>
              <AccountCircle fontSize='large'/>
          </IconButton>
          <Button variant="contained" color="secondary" size="medium" onClick={() => {
            console.log('ON SIGNOUT');
            localStorage.removeItem('privKey');
            props.onSignOut();
          }} >
              SIGN OUT
          </Button>
          <Dialog open={dialogOpen} onClose={handleSave} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
        <DialogContent>
           <TextField
            autoFocus
            margin="dense"
            id="name"
            label="First Name"
            fullWidth
            value={new_fname}
            onChange={(e) => onFnameChange(e)}
          /> 
          
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Last Name"
            type="email"
            fullWidth
            value={new_lname}
            onChange={(e) => onLnameChange(e)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={new_email}
            onChange={(e) => onEmailChange(e)}

          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button variant='contained' color='primary' onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
      <div className={classes.toolbarIcon} >
        {/* <Title>Your Sites</Title> */}
      </div>
        <div  className={classes.allListDrawer}>
          <Divider />
          <div className={classes.toolbarIcon}  onClick={()=>changeListTypeHelper(false)}>
            <Title>My Sites</Title>
          </div>
          <Divider />
          <div className={clsx(classes.bucketListStyle,  (isSharedSelected === true) && classes.hideList)}>
            <List >
              <BucketsList bucketList={listBucket} onLoadBucket = {onLoadBucket}/>
            </List>
          </div>
          <Divider  />
          <div className={classes.toolbarIcon}  onClick={()=>changeListTypeHelper(true)}>
            
            <Title>Shared With Me</Title>
          </div>
          <Divider />
          <div className={clsx(classes.bucketListStyle,  (isSharedSelected === false) && classes.hideList)}>
            <List >
              <ListSharedBuckets bucketList={sharedListBucket} onSharedLoadBucket = {onLoadBucket}/>
            </List>
          </div>
          <Divider  />
          
        </div>  
        <Divider  />
        <NewBucket setIsSharedSeleted={setIsSharedSeleted} userTID={threadID} setLoading={setLoading} buckets={buckets} bucketList={listBucket} setBucketList={setListBucket} onLoadBucket = {onLoadBucket}  />
      </Drawer>
      {screen}
    </div>
  );
}