import './App.css';
import { useEffect, useState } from 'react';
import Dashboard from './screens/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserData } from './store/actions/userDataAction';
import { CircularProgress, Box, Button, Popover } from '@material-ui/core';
import {reactLocalStorage} from 'reactjs-localstorage';
import WelcomeScreen from './screens/WelcomeScreen';
import { Users } from '@spacehq/users';
import { Alert, AlertTitle } from '@material-ui/lab';
// import {} from '@ma'
//Key:
// const pk = "bbaareqdduw5i2nsibxkizuxv4fycv6iwre4zxm66igp4e62nnnuacc3a4y4z47j26pjg7wspppr35njgv6ii6ot7k64wrvvpe57csnnsh76di"
const users = new Users({ endpoint: 'wss://auth.space.storage' });

function App() {
  // const [bucketInfo, setBucketName] = useState('');
  // const [buckets, setBucket] = useState();
  // const [clickedLogin, setClickedLogin] = useState(false);
  // const [login, setLoginInfo] = useState();
  // const [prvKey, setPrivKey] = useState('');
  // const [spaceStorage, setSpaceStorage] = useState();
  // const [files, setFiles] = useState([]);

  // const onBucketNameHandler = (event) => {
  //   setBucketName({bucketName: event.target.value});
  // }

  // const onLoginHandler = () => {
  //   setClickedLogin(true);
  // }

  // const onSetPrivKey = (event) => {
  //   setPrivKey(event.target.value);
  // }

  // const onLoginInfoHandler = async() => {
  //   console.log(prvKey);
  //   const new_id = PrivateKey.fromString(prvKey);//createIdentityFromString("")
  //   const new_id2 = await users.authenticate(new_id);
  //   console.log('[App.js] onLoginInfoHandler', new_id2);
  //   setClickedLogin(false);
  //   setLoginInfo(new_id2);
  //   const spaceStorage = new UserStorage(new_id2);
  //   setSpaceStorage(spaceStorage);
  //   const bucketsInfo = Buckets.withUserAuth(new_id2.storageAuth);
  //   setBucket(bucketsInfo);
  // }

  // const onSingUpHandler = async() => {
  //   const id = await users.createIdentity();
  //   const new_id = await users.authenticate(id);
  //   console.log('[App.js] onSignUpHandler',new_id);
  //   // id.toString()
  //   setLoginInfo(new_id);
  //   const spaceStorage = new UserStorage(new_id);
  //   setSpaceStorage(spaceStorage);
  //   const bucketsInfo = Buckets.withUserAuth(new_id.storageAuth);
  //   setBucket(bucketsInfo);
  // }

  // const addFile = async(files) => {
  //   console.log('[App.js] addFile', buckets, spaceStorage);
  //   if(!spaceStorage) {
  //     return (<div><h3>SpaceStorage not set</h3></div>);
  //   }
    
  //   const {root, threadID} = await buckets.getOrCreate(bucketInfo.bucketName);
  //   const buck_links = await buckets.links(root.key, '');
  //   setBucketName(currState => { return {...currState, links: buck_links}});
  //   console.log(buck_links);
  //   const path = '';
  //   const arrayFiles = [];
  //   for (const file of files) {
  //     const name = file.name;
  //     const num = file.path.indexOf("/");
  //     // path = 
  //     // console.log();
  //     // console.log(file.path);
  //     // console.log(root);
  //     const file_info = {content: file.stream(), mimeType: file.type};
  //     // console.log(file_info);
  //     const pushFile = await buckets.pushPath(root.key, file.path.substr(num+1), file_info);
  //     console.log(pushFile);
  //     arrayFiles.push({directoryPath: file.path, ipfsPath: pushFile});
  //   }
  //   setFiles(arrayFiles);
  // }
  
  
  // /**
  //  * @param {acceptedFiles} File[]
  //  */
  // const handleDrop = async (acceptedFiles) => {
  //   setFiles([]);
  //   console.log('onDrop');
  //   console.log(acceptedFiles);
  //   addFile(acceptedFiles);
  // } 

  // let screen = (<div className='buttonContainer'>
  //               <button onClick={onSingUpHandler}>SignUp</button>
  //               <button onClick={onLoginHandler}>Login</button>
  //             </div>);
  // let showLoginInput = null;
  // if(login) {
  //   screen = (
  //     <div>
  //       <h3>Your privKey: {login.identity.toString()}</h3>
  //       <input placeholder='Enter name of Bucket' type='text' onChange={onBucketNameHandler}/>
  //       <div className='buttonContainer'>
          
  //         <Dropzone 
  //           onDrop={handleDrop}
  //           maxSize={20000000}
  //           multiple={true}
  //           >
  //           {({getRootProps, getInputProps}) => (
              
  //             <div className='dropZone' {...getRootProps()}>
  //               <input {...getInputProps()} directory="" webkitdirectory="" type="file"  />
  //               <span>DRAG & DROP</span>
  //             </div>
  //           )}
  //         </Dropzone>
  //         <button >Show files</button>
  //       </div>
  //     </div>
  //   );
  // }

  // if(clickedLogin) {
  //   showLoginInput = (<div>
  //     <input type='text' placeholder='Enter private Key' onChange={onSetPrivKey}/>
  //     <button onClick={onLoginInfoHandler}>LOGIN</button>
  //   </div>);
  //   screen = null;
  // }

  // let filesScreen = null;
  // if(files.length > 0) {
  //   let directoryFiles = files.map(files => {
  //     return <div key={files.directoryPath}>
  //           <h6>{files.directoryPath}</h6>
  //           <p>IPFS PATH: {files.ipfsPath.path.path}</p>
  //           </div>
  //   });
  //   {console.log(files)}
  //   filesScreen = (<div>
  //     <h4>Bucket Name: {bucketInfo.bucketName}</h4>
  //     <h5>Bucket Links: </h5>
  //     <ul>
  //     <li>url: {bucketInfo.links.url}</li>
  //     <li>www: {bucketInfo.links.www}</li>
  //     <li>ipns: {bucketInfo.links.ipns}</li>
  //     <li>Root Path: {files[files.length-1].ipfsPath.root}</li>
  //     </ul>
  //     {directoryFiles}
  //   </div>)

  // }
  const dispatch = useDispatch();
  const user_data = useSelector(state => state.user_data);
  const [isAuth, setIsAuth] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [loadReason, setLoadReason] = useState('Welcome! Checking if already logged in');
  useEffect(()=> {
    onFirstLoad();
  }, []);

  useEffect(() => {
    console.log('OTHER EFFECT');
  }, [user_data])

  const onFirstLoad = () => {
    // reactLocalStorage.remove('privKey');
    const pk = reactLocalStorage.get('privKey');
    if(pk) {
      setIsAuth(true);
      setLoadReason('Authenticating you and getting you started');
      dispatch(loadUserData(pk, false));
    }
  }

  const onSignupClick = async() => {
    console.log('IN SIGN UP FUNC');
    setLoadReason('Creating new account and getting you started');
    const identity = await users.createIdentity();
    const pk = identity.toString();
    console.log('SIGNUP ID: ', pk);
    dispatch(loadUserData(pk, true));
    // reactLocalStorage.set('privKey', identity.toString());
    const element = document.createElement("a");
    const file = new Blob([identity.toString()], {type: 'text/plain'});
    // console.log('FILE: ', file);
    element.href = URL.createObjectURL(file);
    element.download = "PrivateKey.txt";
    // console.log('BEFORE APPEND');
    document.body.appendChild(element); 
    // console.log('BEFORE CLICK');
    element.click();
    // console.log('DOWNLOADING...');
    setIsAuth(true);
    setSignUp(true);
    setOpenPopover(true);
  }

  const onCheckLogin = async(pk, rememberMe) => {
    setLoadReason('Signing you up and getting you started');
    dispatch(loadUserData(pk, rememberMe));
    setIsAuth(true);
  }

  let screen2 = (
    <div style={{marginTop: window.innerHeight/2, marginLeft: window.innerWidth/2}}>
        <CircularProgress size={80}/>
        <h4 style={{marginLeft: -40}}>{loadReason}</h4>
    </div>
    )

  console.log('USER_DATA APP.js', user_data);

  if(user_data.error) {
    alert(user_data.error);
  }
  if(!isAuth) {
    screen2 = (<WelcomeScreen onCheckLogin={onCheckLogin} onSignUp={onSignupClick}/>);
  } 
  if(!user_data.isLoading && !user_data.error) {
    let signUpalert = null;
    if(signUp) {
      signUpalert = (
        <Popover
          open={openPopover}
          >
          <Alert severity="success" 
          action={
              <Button color="inherit" size="small" onClick={() => setOpenPopover(false)}>
                OK
              </Button>
            }>
              <AlertTitle>PRIVATE KEY DOWNLOADED SUCCESSFULLY</AlertTitle>
                <strong>Keep it securely to log in again!</strong>
          </Alert>
         </Popover>
      );
    }
    screen2 = (
      <>
        {signUpalert}
        <Dashboard />
      </>
      )
  } 
  return (
    // <div className="App">
    //   {screen}
    //   {showLoginInput}
    //   {filesScreen}
    // </div>

    <div>
      {screen2}
    </div>
  );
}

export default App;
