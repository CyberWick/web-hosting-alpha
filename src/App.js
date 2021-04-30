import './App.css';
import Dropzone from 'react-dropzone';
import {Users, UserStorage, AddItemsResultSummary} from '@spacehq/sdk';
import {Buckets, PrivateKey} from '@textile/hub';
import { useState } from 'react';

//Key:
//bbaareqdduw5i2nsibxkizuxv4fycv6iwre4zxm66igp4e62nnnuacc3a4y4z47j26pjg7wspppr35njgv6ii6ot7k64wrvvpe57csnnsh76di

const users = new Users({ endpoint: 'wss://auth.space.storage' });

function App() {
  const [bucketInfo, setBucketName] = useState('');
  const [buckets, setBucket] = useState();
  const [clickedLogin, setClickedLogin] = useState(false);
  const [login, setLoginInfo] = useState();
  const [prvKey, setPrivKey] = useState('');
  const [spaceStorage, setSpaceStorage] = useState();
  const [files, setFiles] = useState([]);

  const onBucketNameHandler = (event) => {
    setBucketName({bucketName: event.target.value});
  }

  const onLoginHandler = () => {
    setClickedLogin(true);
  }

  const onSetPrivKey = (event) => {
    setPrivKey(event.target.value);
  }

  const onLoginInfoHandler = async() => {
    console.log(prvKey);
    const new_id = PrivateKey.fromString(prvKey);//createIdentityFromString("")
    const new_id2 = await users.authenticate(new_id);
    console.log('[App.js] onLoginInfoHandler', new_id2);
    setClickedLogin(false);
    setLoginInfo(new_id2);
    const spaceStorage = new UserStorage(new_id2);
    setSpaceStorage(spaceStorage);
    const bucketsInfo = Buckets.withUserAuth(new_id2.storageAuth);
    setBucket(bucketsInfo);
  }

  const onSingUpHandler = async() => {
    const id = await users.createIdentity();
    const new_id = await users.authenticate(id);
    console.log('[App.js] onSignUpHandler',new_id);
    // id.toString()
    setLoginInfo(new_id);
    const spaceStorage = new UserStorage(new_id);
    setSpaceStorage(spaceStorage);
    const bucketsInfo = Buckets.withUserAuth(new_id.storageAuth);
    setBucket(bucketsInfo);
  }

  const addFile = async(files) => {
    console.log('[App.js] addFile', buckets, spaceStorage);
    if(!spaceStorage) {
      return (<div><h3>SpaceStorage not set</h3></div>);
    }
    
    const {root, threadID} = await buckets.getOrCreate(bucketInfo.bucketName);
    const buck_links = await buckets.links(root.key, '');
    setBucketName(currState => { return {...currState, links: buck_links}});
    console.log(buck_links);
    const path = '';
    const arrayFiles = [];
    for (const file of files) {
      const name = file.name;
      // const num = file.path.indexOf("/");
      // path = 
      // console.log(file.path.substr(num+1));
      console.log(file.path);
      // console.log(root);
      const file_info = {content: file.stream(), mimeType: file.type};
      // console.log(file_info);
      const pushFile = await buckets.pushPath(root.key, file.path, file_info);
      console.log(pushFile);
      arrayFiles.push({directoryPath: file.path, ipfsPath: pushFile});
    }
    setFiles(arrayFiles);
  }
  
  
  /**
   * @param {acceptedFiles} File[]
   */
  const handleDrop = async (acceptedFiles) => {
    console.log('onDrop');
    console.log(acceptedFiles);
    addFile(acceptedFiles);
  } 

  let screen = (<div className='buttonContainer'>
                <button onClick={onSingUpHandler}>SignUp</button>
                <button onClick={onLoginHandler}>Login</button>
              </div>);
  let showLoginInput = null;
  if(login) {
    screen = (
      <div>
        <h3>Your privKey: {login.identity.toString()}</h3>
        <input placeholder='Enter name of Bucket' type='text' onChange={onBucketNameHandler}/>
        <div className='buttonContainer'>
          
          <Dropzone 
            onDrop={handleDrop}
            maxSize={20000000}
            multiple={true}
            >
            {({getRootProps, getInputProps}) => (
              
              <div className='dropZone' {...getRootProps()}>
                <input {...getInputProps()} directory="" webkitdirectory="" type="file"  />
                <span>DRAG & DROP</span>
              </div>
            )}
          </Dropzone>
          <button >Show files</button>
        </div>
      </div>
    );
  }

  if(clickedLogin) {
    showLoginInput = (<div>
      <input type='text' placeholder='Enter private Key' onChange={onSetPrivKey}/>
      <button onClick={onLoginInfoHandler}>LOGIN</button>
    </div>);
    screen = null;
  }

  let filesScreen = null;
  if(files.length > 0) {
    let directoryFiles = files.map(files => {
      return <div key={files.directoryPath}>
            <h6>{files.directoryPath}</h6>
            <p>IPFS PATH: {files.ipfsPath.path.path}</p>
            </div>
    });
    {console.log(files)}
    filesScreen = (<div>
      <h4>Bucket Name: {bucketInfo.bucketName}</h4>
      <h5>Bucket Links: </h5>
      <ul>
      <li>url: {bucketInfo.links.url}</li>
      <li>www: {bucketInfo.links.www}</li>
      <li>ipns: {bucketInfo.links.ipns}</li>
      <li>Root Path: {files[files.length-1].ipfsPath.root}</li>
      </ul>
      {directoryFiles}
    </div>)

  }
  return (
    <div className="App">
      {screen}
      {showLoginInput}
      {filesScreen}
    </div>
  );
}

export default App;
