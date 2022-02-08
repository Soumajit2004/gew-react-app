import {createStore, applyMiddleware} from "redux";
import rootReducer from "./root-reducer";
import {persistStore} from "redux-persist";

const middlewares = [];

export const store = createStore(rootReducer, applyMiddleware(...middlewares))

export const persistor = persistStore(store)

export default {store, persistor}