import {combineReducers} from "redux";
import {persistReducer} from "redux-persist";
import userReducer from "./user/user.reducer";
import poReducer from "./po/po.reducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key:"root",
    storage,
    whitelist:["user"]
}

const rootReducer = combineReducers({
    user:userReducer,
    po:poReducer
})

export default persistReducer(persistConfig, rootReducer);