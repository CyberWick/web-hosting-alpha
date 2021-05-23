import { Users } from "@spacehq/users";
import { Buckets, Client, PrivateKey, Query } from "@textile/hub";
import { reactLocalStorage } from "reactjs-localstorage";

export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const LOAD_USER_DATA_ERROR = 'LOAD_USER_DATA_ERROR';
export const LOAD_THREADID = 'LOAD_THREADID'
export const LOAD_THREADID_ERROR = 'LOAD_THREADID_ERROR'


const users = new Users({ endpoint: 'wss://auth.space.storage' });

export const loadUserAccess = (spaceUser, buckets, client, threadID, user_details) => {
    return {
        type: LOAD_USER_DATA,
        spaceUser: spaceUser,
        buckets: buckets,
        client: client,
        threadID: threadID,
        user_details: user_details
    }
}

export const loadUserError = (err) => {
    return {
        type: LOAD_USER_DATA_ERROR,
        err: err,
    }
}

export const loadThreadID = (threadID) => {
    return {
        type: LOAD_THREADID,
        threadID: threadID
    }
}

export const loadThreadIDError = (err) => {
    return {
        type: LOAD_THREADID_ERROR,
        err: err
    }
}

export const loadUserData = (pk, rememberMe, user_details) => {
    return dispatch => {
        console.log('LOADING USER DATA REDUCER')
        try {
            const identity = PrivateKey.fromString(pk);
            const spaceUser = users.authenticate(identity).then(async(spaceUser) => {
                console.log('LOADUSERDATA - SPACEUSER', spaceUser)
                const buckets = Buckets.withUserAuth(spaceUser.storageAuth);
                const client = Client.withUserAuth(spaceUser.storageAuth);
                if(rememberMe) {
                    reactLocalStorage.set('privKey', pk);
                }

                let threadID

                if(!(user_details == null))
                {
                    const colls = await client.listDBs()
                    console.log('colls', colls)
                    
                    console.log('USER_DETAILS', user_details)
                    threadID = await client.newDB(undefined, 'userDatastore')
                    console.log('THREADID', threadID.toString())
                    
                    await client.newCollectionFromObject(threadID, user_details, {name: 'userProfile'})
                    await client.create(threadID, 'userProfile', [user_details])

                    const query = new Query().orderByID()
                    const result = await client.find(threadID, 'userProfile', query);
                    console.log('NEW USER ADDED TO THREADDB', result);

                }
                dispatch(loadUserAccess(spaceUser, buckets, client,threadID, user_details));
            });
        } catch (err) {
            console.log('LOADING USER DATA FAILURE', err);
            dispatch(loadUserError(err));
        }

    }
}