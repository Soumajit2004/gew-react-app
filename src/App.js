import React, {lazy, Suspense} from "react";
import "./App.css"
import {Redirect, Route, Switch} from "react-router";
import {connect} from "react-redux";
import {auth, db} from "./firebase/firebase.utils";
import {selectCurrentUser} from "./redux/user/user.selector";
import {setCurrentUser} from "./redux/user/user.actions";
import {doc, getDoc} from "firebase/firestore";
import {withRouter} from "react-router-dom";
import IsLoadingSpinner from "./components/withSpinner/isLoadingSpinner";
import ErrorBoundary from "./components/error-bondary/error-boundry.componenet";
import CustomSnackBar from "./components/snackbar/snackbar.component";

const HomePage = lazy(() => import("./pages/homepage/homepage.component"))
const SignInPage = lazy(() => import("./pages/signinpage/signinpage.component"))
const DashboardPage = lazy(() => import("./pages/dashboardpage/dashboardpage.component"))
const PoPage = lazy(() => import("./pages/popage/popage.component"))
const RegisterPage = lazy(() => import("./pages/registerpage/registerpage.component"))
const PayoutPage = lazy(()=>import("./pages/payoutpage/payoutpage.component"))

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
            <div className="App" id="app">
                <CustomSnackBar/>

                <Switch>
                    <ErrorBoundary>
                        <Suspense fallback={<IsLoadingSpinner/>}>
                            <Route exact path="/" component={HomePage}/>
                            <Route exact path="/sign-in"
                                   render={() => (currentUser ? <Redirect to="/dashboard"/> : <SignInPage/>)}/>
                            <Route exact path="/dashboard"
                                   render={() => (currentUser ? <DashboardPage/> : <Redirect to="/sign-in"/>)}/>
                            <Route exact path="/po-manager"
                                   render={() => currentUser ? (<PoPage/>) : (<Redirect to="/sign-in"/>)}/>
                            <Route exact path="/register"
                                   render={() => currentUser.role !== "field" ? (<RegisterPage/>) : (<Redirect to="/sign-in"/>)}/>
                            <Route exact path="/payouts"
                                   render={() => currentUser.role === "owner" ? (<PayoutPage/>) : (<Redirect to="/dashboard"/>)}/>
                        </Suspense>
                    </ErrorBoundary>
                </Switch>
            </div>
        );
    }


}

const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state),
})

const mapDispatchToProp = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProp)(App));
