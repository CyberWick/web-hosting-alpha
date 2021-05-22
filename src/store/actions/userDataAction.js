import { Users } from "@spacehq/users";
import { Buckets, Client, PrivateKey } from "@textile/hub";
import { reactLocalStorage } from "reactjs-localstorage";

export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const LOAD_USER_DATA_ERROR = 'LOAD_USER_DATA_ERROR';

const users = new Users({ endpoint: 'wss://auth.space.storage' });

export const loadUserAccess = (spaceUser, buckets, client) => {
    return {
        type: LOAD_USER_DATA,
        spaceUser: spaceUser,
        buckets: buckets,
        client: client
    }
}

export const loadUserError = (err) => {
    return {
        type: LOAD_USER_DATA_ERROR,
        err: err,
    }
}

export const loadUserData = (pk, rememberMe) => {
    return dispatch => {
        console.log('LOADING USER DATA REDUCER')
        try {
            const identity = PrivateKey.fromString(pk);
            const spaceUser = users.authenticate(identity).then(spaceUser => {
                console.log('LOADUSERDATA - SPACEUSER', spaceUser)
                const buckets = Buckets.withUserAuth(spaceUser.storageAuth);
                const client = Client.withUserAuth(spaceUser.storageAuth);
                if(rememberMe) {
                    reactLocalStorage.set('privKey', pk);
                }
                dispatch(loadUserAccess(spaceUser, buckets, client));
            });
        } catch (err) {
            console.log('LOADING USER DATA FAILURE', err);
            dispatch(loadUserError(err));
        }

    }
}