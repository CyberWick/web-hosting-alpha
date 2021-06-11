import { Button, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import BgImage from '../assets/images/g20.png';
import HashImage from '../assets/images/hash.svg';
import SecureImage from '../assets/images/secure.svg';
import ShareImage from '../assets/images/share.png';

const useStyles = makeStyles((theme) => ({
    screen: {
        height: window.innerHeight,
        backgroundImage: `url(${BgImage})`,
        width: window.innerWidth,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    inpaper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        opacity: 0.7,
        width: window.innerWidth/4,
    }
}));

const About = () => {
    const styles = useStyles();
    return (
        <div className={styles.screen}> 
            {/* <Grid container direction='column' justify='flex-start' alignItems='center' 
                style={{backgroundColor: 'white', opacity: 0.7, width: window.innerWidth/2, height: window.innerHeight/2}} > */}
            {/* <Grid container */}
            <Grid spacing={0} container direction='column' alignItems='center' justify='flex-start' 
                    style={{backgroundColor: 'white', height: window.innerHeight/1.25, opacity: 0.8, width: window.innerWidth/1.15, borderRadius: 20}}>
                <Grid item>
                    <p style={{fontSize: 48,}}>How we work?</p>
                </Grid>
                <Grid item container direction='row' alignItems='center' justify='center' >
                    <Grid item container justify='center' alignItems='center' xs={12} sm={3} >
                        <img style={{opacity: 1, width: 154, height: 154}} alt='Hash' src={HashImage} />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {'Your file, and all of the blocks within it, is given a unique fingerprint called a cryptographic hash. Every object is stored in chunks of 256 kB, which again is given a unique hash. Combining the hashes of every chunk gives the root hash called as CID.'} 
                    </Grid>
                </Grid>
                <Grid item container direction='row' alignItems='center' justify='center' >
                    <Grid item container justify='center' alignItems='center' xs={12} sm={3}>
                        <img style={{opacity: 1, width: 128, height: 128}} alt='Hash' src={SecureImage} />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {/* {'Secure your data using '} */}
                        {'Secure your data hosted on IPFS by AES encryption using a token generated in your crypto identity.'} 
                    </Grid>
                </Grid>
                <Grid item container direction='row' alignItems='center' justify='center' >
                    <Grid item container justify='center' alignItems='center' xs={12} sm={3}>
                        <img style={{opacity: 1, width: 154, height: 154}} alt='Hash' src={ShareImage} />
                    </Grid>
                    <Grid item xs={12} sm={9} >
                        {'Add collaborators to your decentralised website.'} 
                    </Grid>
                </Grid>
                {/*   */}
                {/* <Grid item container direction='column'>
                <Grid item>
                    <p style={{fontSize: 36}}>Take a closer look</p>
                </Grid> */}
                <Grid item container direction='row' alignItems='center' justify='center' style={{marginTop: 30,}}>
                    <Grid item xs={12} sm={4} container justify='center' alignItems='center'>
                        {/* <div style={{backgroundColor: 'blue'}}> */}
                            <Button variant='contained' color='primary' onClick={() => {
                                window.open('https://docs.textile.io/');
                            }}> VISIT Textile </Button>
                        {/* </div> */}
                    </Grid>
                    <Grid item xs={12} sm={4} container justify='center' alignItems='center'>
                        <Button variant='contained' color='primary' onClick={() => {
                            window.open('https://docs.ipfs.io');
                        }}>VISIT IPFS</Button>
                    </Grid>
                    <Grid item xs={12} sm={4} container justify='center' alignItems='center'>
                        <Button variant='contained' color='primary' onClick={() => {
                            window.open('https://fleekhq.github.io/space-sdk/docs/');
                        }}>VISIT SPACE-SDK</Button>
                    </Grid>
                </Grid>
                {/* </Grid> */}
            </Grid>
        </div>
    );
}

export default About;