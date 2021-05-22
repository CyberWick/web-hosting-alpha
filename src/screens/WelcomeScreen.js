import React, { useState } from 'react';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

const WelcomeScreen = (props) => {
    const [isAlreadyRegistered, setAlreadyRegistered] = useState(false);

    const onRegisterToggle = () => {
        setAlreadyRegistered(prev => !prev);
    }
    let screen = <SignUp onToggle={onRegisterToggle} onSignUp={props.onSignUp}/>
    if(isAlreadyRegistered) {
        screen = <SignIn onCheckLogin={props.onCheckLogin} onToggle={onRegisterToggle}/>
    }
    return (
        <>
        {screen}
        </>
    );
};

export default WelcomeScreen;