import {combineReducers} from "redux";
import {persistReducer} from "redux-persist";
import userReducer from "./user/user.reducer";
import poReducer from "./po/po.reducer";
import storage from "redux-persist/lib/storage";
import snackbarReducer from "./snackbar/snackbar.reducer";
import recentPoReducer from "./recentPo/recentPo.reducer";

const persistConfig = {
    key:"root",
    storage,
    whitelist:["user", "snackbar"]
}

const rootReducer = combineReducers({
    user:userReducer,
    po:poReducer,
    snackbar:snackbarReducer,
    recentPo:recentPoReducer
})

export default persistReducer(persistConfig, rootReducer);