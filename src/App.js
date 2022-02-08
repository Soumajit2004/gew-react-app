import React from "react";
import "./App.css"
import {Redirect, Route, Switch} from "react-router";
import HomePage from "./pages/homepage/homepage.component";
import SignInPage from "./pages/signinpage/signinpage.component";
import DashboardPage from "./pages/dashboardpage/dashboardpage.component";
import PoPage from "./pages/popage/popage.component";
import {connect} from "react-redux";
import {auth} from "./firebase/firebase.utils";
import {selectCurrentUser} from "./redux/user/user.selector";
import {setCurrentUser} from "./redux/user/user.actions";

// eslint-disable-next-line no-undef
class App extends React.Component {
    unsubscribeFromAuth = null;

    componentDidMount() {
        const {setCurrentUser} = this.props

        this.unsubscribeFromAuth = auth.onAuthStateChanged(user => {setCurrentUser(user)})
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
                    <Route exact
                           path="/sign-in"
                           component={SignInPage}/>
                    <Route exact path="/office/dashboard" render={() => currentUser ? (<DashboardPage/>) : (<Redirect to="/sign-in"/>)} />
                    <Route exact path="/office/po-manager" render={() => currentUser ? (<PoPage/>) : (<Redirect to="/sign-in"/>)}/>
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

export default connect(mapStateToProps, mapDispatchToProp)(App);
