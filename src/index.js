import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@emotion/react";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {store, persistor} from "./redux/store"

const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#311b92',
        },
        secondary: {
            main: '#80deea',
        },
        success: {
            main: '#4caf50',
        },
    },
    typography: {
        h1: {
            fontFamily: 'Poppins',
            fontSize: '6.3rem',
        },
        h2: {
            fontFamily: 'Poppins',
        },
        h3: {
            fontFamily: 'Poppins',
        },
        h4: {
            fontFamily: 'Poppins',
        },
        h5: {
            fontFamily: 'Poppins',
        },
        subtitle1: {
            fontFamily: 'Roboto',
        },
        button: {
            fontFamily: 'Poppins',
            fontSize: '1.1rem',
        },
        overline: {
            fontFamily: 'Poppins',
        },
        h6: {
            fontFamily: 'Poppins',
        },
    },
});

ReactDOM.render(
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <PersistGate persistor={persistor}>
                        <App/>
                    </PersistGate>
                </BrowserRouter>
            </ThemeProvider>
        </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
