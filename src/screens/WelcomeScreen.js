import React, { useState } from 'react';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import BgImage from '../assets/images/g20.png'
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    screen: {
        backgroundImage: `url(${BgImage})`
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
    }
}))

const WelcomeScreen = (props) => {
    const styles = useStyles();
    const [isAlreadyRegistered, setAlreadyRegistered] = useState(false);

    const onRegisterToggle = () => {
        setAlreadyRegistered(prev => !prev);
    }
    let screen = <SignUp onToggle={onRegisterToggle} onSignUp={props.onSignUp}/>
    if(isAlreadyRegistered) {
        screen = <SignIn onCheckLogin={props.onCheckLogin} onToggle={onRegisterToggle}/>
    }
    return (
        <div className={styles.screen}>
            {/* <div className={styles.content}> */}
                <Grid container spacing={1} direction='row' alignItems='center' justify='space-evenly' xs={12} 
                    style={{height: window.innerHeight}}>
                    <Grid item container xs={12} sm={8} direction='column' justify='center' alignItems='center' 
                    // style={{backgroundColor: 'red'}}
                    >
                        <Grid item>
                        {/* <Typography variant='h5' color='textSecondary'></Typography> */}
                        <p style={{color: 'white', fontSize: 54, fontWeight: '500'}}>G20 Web Hosting Dapp</p>
                        </Grid>
                        <Grid item>
                            {/* <Typography></Typography> */}
                            <h5 style={{color: 'white', marginTop: -5, textAlign: 'center'}}>A peer-to-peer solution for your website hosting, make it more faster, safer and open. 
                            <p ><Link to='/about' style={{color: 'white'}}>Click to know how?</Link></p>
                            </h5>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                    {/* // style={{backgroundColor: 'blue'}}> */}
                        {screen}
                    </Grid>
                </Grid>
                {/* <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', marginLeft: 30}}>
                </div> */}
            {/* </div> */}
        </div>
    );
};

export default WelcomeScreen;