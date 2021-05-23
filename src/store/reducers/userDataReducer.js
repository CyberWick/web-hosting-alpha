import { LOAD_USER_DATA, LOAD_USER_DATA_ERROR, ON_USER_SIGN_OUT } from "../actions/userDataAction";

const initialState = {
    spaceUser: null,
    buckets: null,
    client: null,
    threadID: null,
    user_details: null,
    error: null,
    isLoading: true,
}

const userDataReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_USER_DATA: 
            return {
                ...state,
                spaceUser: action.spaceUser,
                buckets: action.buckets,
                client: action.client,
                threadID: action.threadID,
                user_details: action.user_details,
                isLoading: false,
                error: null,
            }
        case LOAD_USER_DATA_ERROR: 
            return {
                ...state,
                isLoading: false,
                error: action.err,
            }
        case ON_USER_SIGN_OUT: 
            return {
               ...initialState
            }
        default: 
            return state;
    }
}

export default userDataReducer;