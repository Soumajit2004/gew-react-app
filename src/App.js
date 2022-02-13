import React from "react";
import "./App.css"
import {Redirect, Route, Switch} from "react-router";
import HomePage from "./pages/homepage/homepage.component";
import SignInPage from "./pages/signinpage/signinpage.component";
import DashboardPage from "./pages/dashboardpage/dashboardpage.component";
import PoPage from "./pages/popage/popage.component";
import {connect} from "react-redux";
import {auth, db} from "./firebase/firebase.utils";
import {selectCurrentUser} from "./redux/user/user.selector";
import {setCurrentUser} from "./redux/user/user.actions";
import RegisterPage from "./pages/registerpage/registerpage.component";
import {doc, getDoc} from "firebase/firestore";
import {withRouter} from "react-router-dom";

// eslint-disable-next-line no-undef
class App extends React.Component {
    unsubscribeFromAuth = null;

    componentDidMount() {
        const {setCurrentUser} = this.props

        this.unsubscribeFromAuth = auth.onAuthStateChanged(user => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                getDoc(userRef)
                    .then((r) => {
                        setCurrentUser({...user, ...r.data()})
                    })
            } else {
                setCurrentUser(user)
            }

        })
    }

    componentWillUnmount() {
        this.unsubscribeFromAuth()
    }



    render() {
        const {currentUser} = this.props

        return (
            <div className="App">
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/sign-in" render={() => (currentUser ? <Redirect to="/dashboard"/> : <SignInPage/>)}/>
                    <Route exact path="/dashboard" render={() => (currentUser ? <DashboardPage/> : <Redirect to="/sign-in"/>)}/>
                    <Route exact path="/po-manager" render={() => currentUser ? (<PoPage/>) : (<Redirect to="/sign-in"/>)}/>
                    <Route exact path="/register" render={() => currentUser ? (<RegisterPage/>) : (<Redirect to="/sign-in"/>)}/>
                </Switch>
            </div>
        );
    }


}

const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state)
})

const mapDispatchToProp = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProp)(App));
