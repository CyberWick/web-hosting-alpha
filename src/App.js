import './App.css';
import { useEffect, useState } from 'react';
import Dashboard from './screens/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserData, onUserSignOut } from './store/actions/userDataAction';
import { CircularProgress, Button, Popover } from '@material-ui/core';
import {reactLocalStorage} from 'reactjs-localstorage';
import WelcomeScreen from './screens/WelcomeScreen';
import { Users } from '@spacehq/users';
import { Alert, AlertTitle } from '@material-ui/lab';
//Key:
// const pk = "bbaareqdduw5i2nsibxkizuxv4fycv6iwre4zxm66igp4e62nnnuacc3a4y4z47j26pjg7wspppr35njgv6ii6ot7k64wrvvpe57csnnsh76di"
const users = new Users({ endpoint: 'wss://auth.space.storage' });

function App() {
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
    console.log('CHECKING FOR PTIV KEY');
    const pk = reactLocalStorage.get('privKey');
    if(pk) {
      setIsAuth(true);
      setLoadReason('Authenticating you and getting you started');
      dispatch(loadUserData(pk, false, null));
    }
  }

  const onSignOut = async() => {
    setIsAuth(false);
    await dispatch(onUserSignOut());
  }

  const onSignupClick = async(user_details) => {
    console.log('IN SIGN UP FUNC');
    setLoadReason('Creating new account and getting you started');
    const identity = await users.createIdentity();
    const pk = identity.toString();
    console.log('SIGNUP ID: ', pk);
    console.log('USER DETAILS', user_details)
    dispatch(loadUserData(pk, true, user_details));
    // reactLocalStorage.set('privKey', identity.toString());
    const element = document.createElement("a");
    const file = new Blob([identity.toString()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "PrivateKey.txt";
    document.body.appendChild(element); 
    element.click();
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
  if(!isAuth || user_data.error) {
    screen2 = (<WelcomeScreen onCheckLogin={onCheckLogin} onSignUp={onSignupClick}/>);
  } 
  if(!user_data.isLoading && !user_data.error) {
    let signUpalert = null;
    if(signUp) {
      signUpalert = (
        <Popover
          open={openPopover}>
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
        <Dashboard onSignOut={onSignOut}/>
      </>
      )
  } 
  return (
    <div>
      {screen2}
    </div>
  );
}

export default App;
