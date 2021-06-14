import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Grid,
  Modal,
  Typography,
  Paper,
  ListItem,
  ListItemText,
  List
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';

import InfoOutlined from '@material-ui/icons/InfoOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import TransitionsModal from './uploadData.js'
import Backdrop from '@material-ui/core/Backdrop';
import Title from './Title';

import { Users } from '@spacehq/sdk';
import { Buckets, PrivateKey, ThreadID } from '@textile/hub';
import { globalUsersThreadID } from '../constants/RegisteredUsers.js';
import { useSelector } from 'react-redux';

// Generate Order Data
function createData(id, date, name, isDirectory, cid) {
  return { id, date, name, isDirectory, cid };
}
//*********************************** */
const Roles = ['N/A', 'Reader', 'Writer', 'Admin'];
//*********************************** */

const useStyles = makeStyles((theme) => ({
  tableCell: {
    cursor: 'pointer'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  disableTableCell: {
    cursor: 'not-allowed'
  },
  hideModifyButtons: {
    // visibility: 'hidden',
    display: 'none'
  },
  modifyButtons: {
    padding:"3px 6px",
  },
  staticButtons: {
    padding:"6px",
    cursor: 'default'    
  }
}));


export default function Orders(props) {
  const classes = useStyles();
  const initialData = [
    createData(0, '16 Mar, 2019', 'Data Loading', 0, "")
  ];
  //********************************************** */
  const user_details = useSelector(state => state.user_data.user_details);
  const client = useSelector(state => state.user_data.client);
  //********************************************* */
  const [navStack, setNavStack] = useState([]);
  const [fileToBeEdited, setFileToBeEdited] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [currentDir, setCurrentDir] = useState({})
  const [rows, setRows] = useState(initialData);
  const [toggleAddMenu, setToggleAddMenu] = useState(null);
  const [toggleEditModal, setToggleEditModal] = useState(false);
  const [toggleFolderModal, setToggleFolderModal] = useState(false);
  const [toggleFileModal, setToggleFileModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentModalOpen, setRecentModalOpen] = useState(false);
  const recentActivity = props.recentActivity;

  const handleFolderDrop = async (acceptedFiles) => {
    setLoading(true);
    handleCloseAddMenu();
    //********************************************* */
    const path =  acceptedFiles[0].path.substring(0,acceptedFiles[0].path.indexOf('/'));
    console.log('PATH OF FOLDER: ', path);
    //********************************************* */
    for(const file of acceptedFiles){
        console.log(file.name);
        const file_info = {content: file.stream(), mimeType: file.type};
        // console.log(props.pushPath + file.name);
        await props.buckets.pushPath(props.bucketKey, currentPath.substring(1) + file.path, file_info);
        console.log('File uploaded!!')
    }
    //************************************************** */
    recentActivity.messages.push(user_details.emailid+' ('+user_details.fname+'): ' +'added a folder '+ ('/' + currentPath.substring(1)+path) +' at '+ Date(Date.now()).toString());
    console.log('RECENT ACTIVITY IN DELETE', recentActivity);
    await client.save(ThreadID.fromString(globalUsersThreadID), 'RecentActivities', [recentActivity]);
    //************************************************** */
    // setOpen(false);
    const root = await props.buckets.root(props.bucketKey)
    props.setExplore(root.path)
    setToggleFolderModal(false);
    setLoading(false);
    fetchData(props.bucketKey, props.buckets);
}

const handleFileDrop = async (acceptedFiles) => {
  setLoading(true);
  handleCloseAddMenu();
  for(const file of acceptedFiles){
      console.log(file.name);
      const file_info = {content: file.stream(), mimeType: file.type};
      // console.log(props.pushPath + file.name);
      await props.buckets.pushPath(props.bucketKey, currentPath.substring(1) + file.name, file_info);
      console.log('File uploaded!!')
  }
  //************************************************** */
  recentActivity.messages.push(user_details.emailid+' ('+user_details.fname+'): ' +'added a file '+ ('/' + currentPath.substring(1)+acceptedFiles[0].name) +' at '+ Date(Date.now()).toString());
  console.log('RECENT ACTIVITY IN DELETE', recentActivity);
  await client.save(ThreadID.fromString(globalUsersThreadID), 'RecentActivities', [recentActivity]);
  //************************************************** */
  // setOpen(false);
  const root = await props.buckets.root(props.bucketKey)
  props.setExplore(root.path)
  setLoading(false);
  setToggleFileModal(false);
  fetchData(props.bucketKey, props.buckets);
}

const handleEditDrop = async (acceptedFiles) => {
  setLoading(true);
  handleCloseAddMenu();
  const file = acceptedFiles[0];
  if(acceptedFiles.length !== 1){
    alert('You can modify only single file from here. You added ' + acceptedFiles.length);
    setFileToBeEdited('');
  }else if(file.name !== fileToBeEdited){
    alert('Enter file with same name u wish to edit. You added file : ' + file.name);
    setFileToBeEdited('');
  }else{
    const file_info = {content: file.stream(), mimeType: file.type};
    await props.buckets.pushPath(props.bucketKey, currentPath.substring(1) + file.name, file_info);
    //************************************************** */
    recentActivity.messages.push(user_details.emailid+' ('+user_details.fname+'): ' +'edited a file '+ ('/' + currentPath.substring(1)+acceptedFiles[0].name) +' at '+ Date(Date.now()).toString());
    console.log('RECENT ACTIVITY IN DELETE', recentActivity);
    await client.save(ThreadID.fromString(globalUsersThreadID), 'RecentActivities', [recentActivity]);
    //************************************************** */
  }
  const root = await props.buckets.root(props.bucketKey)
  props.setExplore(root.path)
  setToggleEditModal(false);
  setLoading(false);
  fetchData(props.bucketKey, props.buckets);
}
const handleFolderModalClose = () => {
  setToggleFolderModal(false);
};
const handleFileModalClose = () => {
  setToggleFileModal(false);
};
const handleEditModalClose = () => {
  setToggleEditModal(false);
};

  const handleOpenAddMenu = (event) => {
    setToggleAddMenu(event.currentTarget);
  };

  const handleCloseAddMenu = () => {
    setToggleAddMenu(null);
  };

  const deleteListener = async(name) => {
    setLoading(true);
    console.log('Clicked delete.. ');
    await props.buckets.removePath(props.bucketKey, currentPath.substring(1) + name);
    //************************************************** */
    recentActivity.messages.push(user_details.emailid+' ('+user_details.fname+'): ' +'deleted '+ ('/' + currentPath.substring(1) + name) +' at '+ Date(Date.now()).toString());
    console.log('RECENT ACTIVITY IN DELETE', recentActivity);
    await client.save(ThreadID.fromString(globalUsersThreadID), 'RecentActivities', [recentActivity]);
    //************************************************** */
    console.log('file deleted!!');
    const root = await props.buckets.root(props.bucketKey)
    props.setExplore(root.path)
    setLoading(false);
    fetchData(props.bucketKey, props.buckets);
  }

  const editListener = (fileName) => {
    setFileToBeEdited(fileName);
    console.log('Clicked!!')
    setToggleEditModal(true);
  }

  const refreshData = (item) => {
    let newRows = [createData(0, '', '..', 1,"")];
    let curpath = '/';
    navStack.forEach((element) => {
      item = item.items[element];
      curpath += item.name + '/';
    })
    setCurrentPath(curpath)
    // console.log(item);
    if (item.isDir) {
      let i = 1;
      item.items.forEach((element) => {
        const dateInJs = Math.round(element.metadata.updatedAt/1000000);
        if (element.isDir) {
          newRows.push(createData(i, (new Date(dateInJs)).toDateString(), element.name, 1, element.cid));
        } else if(element.name !== '.textileseed'){
          newRows.push(createData(i, (new Date(dateInJs)).toDateString(), element.name, 0,element.cid));
        }
        i++;
      });
      setRows(newRows);
    } else {
      newRows.push(createData(1, '16 Mar, 2019', 'not a directory', 0, ""));
      setRows(newRows);
    }
  }

  const fetchData = async (bucketKey, buckets) => {
    setLoading(true);
    console.log("Searchin... in ", buckets)
    const list = await buckets.listPath(bucketKey, '', 10)
    // console.log(list)
    setNavStack([]);
    setCurrentDir(list.item);
    let newRows = [createData(0, '', '..', 1,"")];
    let curpath = '/';
    setCurrentPath(curpath)
    // console.log(item);
    if (list.item.isDir) {
      let i = 1;
      list.item.items.forEach((element) => {
        const dateInJs = Math.round(element.metadata.updatedAt/1000000);
        if (element.isDir) {
          newRows.push(createData(i, (new Date(dateInJs)).toDateString(), element.name, 1, element.cid));
        } else if(element.name !== '.textileseed'){
          newRows.push(createData(i, (new Date(dateInJs)).toDateString(), element.name, 0, element.cid));
        }
        i++;
      });
      setRows(newRows);
    } else {
      newRows.push(createData(1, '16 Mar, 2019', 'not a directory', 0,""));
      setRows(newRows);
    }
    setLoading(false);
    console.log(list.item.items.length)
  }

  useEffect(() => {
    console.log("In use effect", props.bucketKey)
    if (props.bucketKey != '')
      fetchData(props.bucketKey, props.buckets);
  }, [props.bucketKey])
  
  return (
    <React.Fragment>
      <div style={{display: 'flex'}}>
        <Title style={{
          width: '100%',
          // backgroundColor: 'yellow',
        }}>{currentPath}</Title>
        {/*********************************** */ }
        <Button variant="contained" color="secondary" style={{marginRight: 10}} onClick={() => setRecentModalOpen(true)}>
          ACTIVITIES
        </Button>
        {/*********************************** */ }
        <Button variant="contained" color="primary" onClick={handleOpenAddMenu} 
        className={clsx(classes.staticButtons, (props.sharedRole !== 0) && classes.hideModifyButtons)}>
          ADD
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={toggleAddMenu}
          keepMounted
          open={Boolean(toggleAddMenu)}
          onClose={handleCloseAddMenu}>
          <MenuItem onClick={() => {
            setToggleFolderModal(true);
          }}>Add Folder</MenuItem>
          <MenuItem onClick={() => {
            setToggleFileModal(true);
          }}>Add File</MenuItem>
        </Menu>
        <TransitionsModal 
            setVisible={toggleFolderModal}
            handleClose={handleFolderModalClose}
            enableFolder={true}
            dropCallBackFun={handleFolderDrop}/>
        <TransitionsModal 
            setVisible={toggleFileModal}
            handleClose={handleFileModalClose}
            enableFolder={false}
            dropCallBackFun={handleFileDrop}/>
        {/*********************************** */ }
        <Modal open={recentModalOpen}
          onClose={() => setRecentModalOpen(false)}
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
          <div style={{backgroundColor: 'white', width: 1000, display: 'flex', justifyContent: 'center'}}>
            <Grid spacing={2} container direction='column' style={{marginLeft: 100, marginRight: 100, marginTop: 20}}>
              <Grid item container direction='column'>
                <Grid item>
                  <Typography color='primary' >Members: </Typography>
                </Grid>
                <Grid item>
                <Table >
                  <TableHead>
                    <TableRow>
                      <TableCell align='left'>Email-ID</TableCell>
                      <TableCell align='left'>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivity.member.map((item) => (
                      <TableRow key={item.pubKey}>
                        <TableCell align='left'>{item.email}</TableCell>
                        <TableCell align='left'>{Roles[item.role]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </Grid>
              </Grid>
              <Grid item container direction='column'>
                <Grid item>
                  <Typography color='secondary'>Activities: </Typography>
                </Grid>
                <Grid item>
                  <Paper style={{maxHeight: 200, overflow: 'auto'}}>
                      <List style={{width: 800}}>
                        {recentActivity.messages.map((item) => (
                          <ListItem alignItems='flex-start' key={item}>
                            <ListItemText 
                              primary={item.substring(0, item.indexOf(':'))}
                              secondary={item.substring(item.indexOf(':')+1)}
                            />
                          </ListItem>
                        )) }
                      </List>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </div>
          
        </Modal>
        {/*********************************** */ }
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell width="20">Type</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Last Modified</TableCell>
            <TableCell width="200" align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {/* <TableCell width="20">{row.isDirectory}</TableCell> */}
              <TableCell width="20">
                <IconButton
                  aria-label="edit"
                  color="primary"
                  className={clsx(classes.staticButtons, (row.isDirectory === 0) && classes.hideModifyButtons)}>
                  <FolderIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  color="secondary"
                  className={clsx(classes.staticButtons, (row.isDirectory === 1) && classes.hideModifyButtons)}>
                  <InsertDriveFileOutlinedIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell
              className={clsx(classes.tableCell, (row.isDirectory === 0) && classes.disableTableCell)} 
              align="left" 
              onClick={() => {
                if(row.isDirectory == 0){
                  return;
                }
                // console.log(navStack);
                if (row.id === 0) {
                  if (navStack.length !== 0) {
                    let tempStack = navStack;
                    tempStack.pop();
                    setNavStack(tempStack);
                    refreshData(currentDir);
                  }
                } else {
                  let tempStack = navStack;
                  tempStack.push(row.id - 1);
                  setNavStack(tempStack);
                  refreshData(currentDir);
                }
              }}>{row.name}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell width="60" align="right">
                <IconButton
                  aria-label="edit"
                  color="primary"
                  className={clsx(classes.modifyButtons, (row.isDirectory === 1) && classes.hideModifyButtons)}
                  onClick={() => {
                    editListener(row.name);
                  }}>
                  <CreateIcon fontSize="small" />
                </IconButton>
                <TransitionsModal 
                  setVisible={toggleEditModal}
                  handleClose={handleEditModalClose}
                  enableFolder={false}
                  dropCallBackFun={handleEditDrop}/>
                <IconButton
                  aria-label="delete"
                  color="secondary"
                  className={clsx(classes.modifyButtons, (row.isDirectory === 1 || props.sharedRole === 2) && classes.hideModifyButtons)}
                  onClick={() => {
                    deleteListener(row.name);
                  }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  color="primary"
                  className={clsx(classes.modifyButtons, (row.name === '..') && classes.hideModifyButtons)}
                  onClick={() => {
                    window.open("https://explore.ipld.io/#/explore"+row.cid, '_blank').focus();
                  }}
                  >
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Backdrop className={classes.backdrop} open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
}