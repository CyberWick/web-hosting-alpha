import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import userDataReducer from "./reducers/userDataReducer";

const rootReducer = combineReducers({
    user_data: userDataReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;