import {createStore, applyMiddleware} from "redux";
import rootReducer from "./root-reducer";
import {persistStore} from "redux-persist";
import createSagaMiddleware from "redux-saga"
import {logger} from "redux-logger";
import rootSaga from "./root-saga";

const sagaMiddleware = createSagaMiddleware()

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === "development"){
    middlewares.push(logger)
}

export const store = createStore(rootReducer, applyMiddleware(...middlewares))

sagaMiddleware.run(rootSaga)

export const persistor = persistStore(store)


const exporter = {store, persistor}
export default exporter