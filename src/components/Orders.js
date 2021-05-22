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
  MenuItem
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import CircularProgress from '@material-ui/core/CircularProgress';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import TransitionsModal from './uploadData.js'
import Backdrop from '@material-ui/core/Backdrop';
import Title from './Title';

import { Users } from '@spacehq/sdk';
import { Buckets, PrivateKey } from '@textile/hub';

// Generate Order Data
function createData(id, date, name, isDirectory) {
  return { id, date, name, isDirectory };
}

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
    
  },
  staticButtons: {
    cursor: 'default'    
  }
}));


export default function Orders(props) {
  const classes = useStyles();
  const initialData = [
    createData(0, '16 Mar, 2019', 'Data Loading', 0)
  ];
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

  const handleFolderDrop = async (acceptedFiles) => {
    setLoading(true);
    handleCloseAddMenu();

    for(const file of acceptedFiles){
        console.log(file.name);
        const file_info = {content: file.stream(), mimeType: file.type};
        // console.log(props.pushPath + file.name);
        await props.buckets.pushPath(props.bucketKey, currentPath.substring(1) + file.path, file_info);
        console.log('File uploaded!!')
    }
    // setOpen(false);
    setLoading(false);
    
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
    // setOpen(false);
  setLoading(false);
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
  }
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
    console.log('file deleted!!');
    setLoading(false);
    fetchData(props.bucketKey, props.buckets);
  }

  const editListener = (fileName) => {
    setFileToBeEdited(fileName);
    console.log('Clicked!!')
    setToggleEditModal(true);
  }

  const refreshData = (item) => {
    let newRows = [createData(0, '', '..', 1)];
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
          newRows.push(createData(i, (new Date(dateInJs)).toDateString(), element.name, 1));
        } else if(element.name !== '.textileseed'){
          newRows.push(createData(i, (new Date(dateInJs)).toDateString(), element.name, 0));
        }
        i++;
      });
      setRows(newRows);
    } else {
      newRows.push(createData(1, '16 Mar, 2019', 'not a directory', 0));
      setRows(newRows);
    }
  }

  const fetchData = async (bucketKey, buckets) => {
    setLoading(true);
    console.log("Searchin...")
    const list = await buckets.listPath(bucketKey, '', 10)
    // console.log(list)
    setNavStack([]);
    setCurrentDir(list.item);
    let newRows = [createData(0, '', '..', 1)];
    let curpath = '/';
    setCurrentPath(curpath)
    // console.log(item);
    if (list.item.isDir) {
      let i = 1;
      list.item.items.forEach((element) => {
        const dateInJs = Math.round(element.metadata.updatedAt/1000000);
        if (element.isDir) {
          newRows.push(createData(i, (new Date(dateInJs)).toDateString(), element.name, 1));
        } else if(element.name !== '.textileseed'){
          newRows.push(createData(i, (new Date(dateInJs)).toDateString(), element.name, 0));
        }
        i++;
      });
      setRows(newRows);
    } else {
      newRows.push(createData(1, '16 Mar, 2019', 'not a directory', 0));
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
          width: '100%'
        }}>{currentPath}</Title>
        <Button variant="contained" color="primary" onClick={handleOpenAddMenu}>
          Add
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
                  className={clsx(classes.modifyButtons, (row.isDirectory === 1) && classes.hideModifyButtons)}
                  onClick={() => {
                    deleteListener(row.name);
                  }}>
                  <DeleteIcon fontSize="small" />
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