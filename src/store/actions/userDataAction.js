import { Users } from "@spacehq/users";
import { Buckets, Client, PrivateKey, Query, ThreadID } from "@textile/hub";
import { reactLocalStorage } from "reactjs-localstorage";
import { globalUsersThreadID } from "../../constants/RegisteredUsers"
const textileSDK = require('@textile/hub');

export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const LOAD_USER_DATA_ERROR = 'LOAD_USER_DATA_ERROR';
export const LOAD_THREADID = 'LOAD_THREADID'
export const LOAD_THREADID_ERROR = 'LOAD_THREADID_ERROR'
export const ON_USER_SIGN_OUT = 'ON_USER_SIGN_OUT';


const users = new Users({ endpoint: 'wss://auth.space.storage' });

export const onUserSignOut = () => {
    return {
        type: ON_USER_SIGN_OUT
    }
}

export const loadUserAccess = (spaceUser, textileUser, buckets, client, threadID, user_details) => {
    return {
        type: LOAD_USER_DATA,
        spaceUser: spaceUser,
        textileUser: textileUser,
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
                const testExisting = await buckets.existing();
                console.log(testExisting);
                const client = Client.withUserAuth(spaceUser.storageAuth);
                if(rememberMe) {
                    reactLocalStorage.set('privKey', pk);
                }
                const textileUser = textileSDK.Users.withUserAuth(spaceUser.storageAuth);
                await textileUser.setupMailbox();

                let threadID

                if(!(user_details == null))
                {
                    const colls = await client.listDBs()
                    console.log('colls', colls)
                    
                    console.log('USER_DETAILS', user_details)
                    threadID = await client.newDB(undefined, 'userDatastore')
                    console.log('THREADID', threadID.toString())

                    const dummySharedObject = {
                        _id: 'bucketKey',
                        role: 0,
                        bucketRoot: {}
                    }
                    
                    await client.newCollectionFromObject(threadID, user_details, {name: 'userProfile'})
                    await client.newCollectionFromObject(threadID, dummySharedObject, {name: 'shared'})
                    await client.create(threadID, 'userProfile', [user_details])

                        const query = new Query().orderByID()
                        const result = await client.find(threadID, 'userProfile', query);
                        console.log('NEW USER ADDED TO THREADDB', result);

                    const globalTID = ThreadID.fromString(globalUsersThreadID);

                    const email = user_details.emailid;
                    const dataFromat = {
                        _id: email,
                        publicKey: identity.public.toString()
                    }
                    console.log('Adding pubKey entry now..');

                    await client.create(globalTID, 'RegisteredUsers', [dataFromat]).catch(err => console.error(err));
                    console.log('EMAIL MAPPED TO PUBLIC KEY');


                    dispatch(loadUserAccess(spaceUser, textileUser, buckets, client,threadID, user_details));
                } else {
                    const threadList = await client.listDBs();
                    console.log('DBs', threadList);
                    const tid = threadList.filter(item => item.name === 'userDatastore');
                    console.log('My TID: ', tid);
                    threadID = ThreadID.fromString(tid[0].id);
                    const query = new Query().orderByID()   
                    const result = await client.find(threadID, 'userProfile', query);
                    console.log('RESULT: ' , result);
                    dispatch(loadUserAccess(spaceUser, textileUser, buckets, client,threadID, result[0]));
                }
                
            });
        } catch (err) {
            console.log('LOADING USER DATA FAILURE', err);
            dispatch(loadUserError(err));
        }

    }
}

