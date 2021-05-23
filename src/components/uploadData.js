import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';

import Dropzone from 'react-dropzone';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';

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

    },
    disableInputType :{
        display: 'none'
    },
    dummyInputStyle:{

    }
}));


const TransitionsModal = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    // if(props.editFile){
    //     setOpen(true);
    // }

    const [loading, setLoading] = React.useState(false);

    // if(!props.setVisible){
    //     return null;
    // }

    const handleDrop = (acceptedFiles) => {
        setOpen(false);
        props.dropCallBackFun(acceptedFiles);
    }

    useEffect(() => {
        setOpen(props.setVisible);
    },[props.setVisible]);
      

    return (
        <div style={{
            marginTop: "30px",
            textAlign: "center",
            display: "inline-block",
            position: "relative"
        }}>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={props.handleClose}
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

                        <div className={clsx(classes.dummyInputStyle, (!props.enableFolder) && classes.disableInputType)}>
                        <Dropzone
                            onDrop={handleDrop}
                            maxSize={20000000}
                            multiple={true}>
                            {({ getRootProps, getInputProps }) => (
                                <div className='dropZone' {...getRootProps()}>
                                    <input {...getInputProps()}
                                    directory="" 
                                    webkitdirectory="" 
                                    type="file"/>
                                    <Button
                                        style={{
                                            marginTop: "25px",
                                            textAlign: "center",
                                        }}
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        startIcon={<CloudUploadIcon />
                                        }>
                                        Select & Upload Folder
                                    </Button>
                                </div>
                            )}
                        </Dropzone>
                        </div>

                        <div className={clsx(classes.dummyInputStyle, (props.enableFolder) && classes.disableInputType)}>
                        <Dropzone
                            onDrop={handleDrop}
                            maxSize={20000000}
                            multiple={true}>
                            {({ getRootProps, getInputProps }) => (
                                <div className='dropZone' {...getRootProps()}>
                                    <input {...getInputProps()}
                                    type="file"/>
                                    <Button
                                        style={{
                                            marginTop: "25px",
                                            textAlign: "center",
                                        }}
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        startIcon={<CloudUploadIcon />
                                        }>
                                        Select & Upload Files
                                    </Button>
                                </div>
                            )}
                        </Dropzone>
                        </div>

                        <Backdrop className={classes.backdrop} open={loading} >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        {/* <Done color="primary"/> */}
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default TransitionsModal;