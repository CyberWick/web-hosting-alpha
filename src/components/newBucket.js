import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';

import Dropzone from 'react-dropzone';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import Done from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "#dddddd",
        borderRadius: "15px",
        minHeight: "20%",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    inputTitle : {
        border: "none",
        borderRadius: "10px",
        height:"25px",
        width: "300px",
        paddingLeft : "10px"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    doneIcon :{
        color: 'primary'

    }
}));

const NewBucket = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };



    
    const [loading, setLoading] = React.useState(false);
    /**
     * @param {acceptedFiles} File[]
     */
    const [title, setTitle] = React.useState('')

    const addFile = async(files, title) => {
        console.log('[App.js] addFile', props.buckets);
        // if(!spaceStorage) {
        //   return (<div><h3>SpaceStorage not set</h3></div>);
        // }
        props.setLoading(true);
        setOpen(false);
        props.buckets.withThread(props.userTID);
        let {root, threadID} = await props.buckets.getOrCreate(title);
        const buck_links = await props.buckets.links(root.key, '');
        // setBucketName(currState => { return {...currState, links: buck_links}});
        const path = '';
        const arrayFiles = [];
        for (const file of files) {
          const name = file.name;
          const file_info = {content: file.stream(), mimeType: file.type};
          const path =  file.path.substring(file.path.indexOf('/')+1)
          const pushFile = await props.buckets.pushPath(root.key, path, file_info);
          console.log(pushFile);
          arrayFiles.push({directoryPath: file.path, ipfsPath: pushFile});
        }
        
        let newBucketList = [...props.bucketList]
        root = await props.buckets.root(root.key)
        newBucketList.push(root)
        props.setBucketList(newBucketList)
        console.log("root", root)
        props.setIsSharedSeleted(false);
        await props.onLoadBucket(root, newBucketList.length-1)
        setTitle('')
        props.setLoading(false);
    }
      
    const handleDrop = async (acceptedFiles) => {
        if(title===''){
            alert("First Enter Title!")
        }
        else{
            console.log('onDrop');
            console.log(acceptedFiles);
            console.log(title);
            addFile(acceptedFiles, title);
        }
        
    }


    return (
        <div style={{
            marginTop: "30px",
            textAlign: "center",
            display: "inline-block",
            position: "relative"
        }}>

            <Button
                onClick={handleOpen}
                variant="contained"
                color="primary"
                className={classes.button}
            >
                New Site {'\u00A0'} <b>+</b>
            </Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}
                        style={{
                            textAlign: "center",
                            display: "inline-block",
                            position: "relative"
                        }}>
                        
                        <input  type="text" className ={classes.inputTitle} placeholder="Please enter site name here"  onChange={event => setTitle(event.target.value)}></input>
                        <Dropzone
                            onDrop={handleDrop}
                            maxSize={20000000}
                            multiple={true}
                        >
                            {({ getRootProps, getInputProps }) => (
                            
                                <div className='dropZone' {...getRootProps()}>
                                    <input {...getInputProps()} directory="" webkitdirectory="" type="file" />
                                    <Button
                                        style={{
                                            marginTop: "25px",
                                            textAlign: "center",
                                        }}
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        startIcon={<CloudUploadIcon />
                                        }
                                    >
                                        Select & Upload Folder
                                    </Button>
                                </div>
                            )}
                        </Dropzone>
                        {/* <Backdrop className={classes.backdrop} open={loading} >
                            <CircularProgress color="inherit" />
                        </Backdrop> */}
                        {/* <Done color="primary"/> */}
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default NewBucket;