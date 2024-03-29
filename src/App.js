import React, {lazy, Suspense, useEffect} from "react";
import "./App.css"
import {Redirect, Route, Switch} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {auth, db} from "./firebase/firebase.utils";
import {selectCurrentUser} from "./redux/user/user.selector";
import {setCurrentUser} from "./redux/user/user.actions";
import {doc, getDoc} from "firebase/firestore";
import IsLoadingSpinner from "./components/withSpinner/isLoadingSpinner";
import ErrorBoundary from "./components/error-bondary/error-boundry.componenet";
import CustomSnackBar from "./components/snackbar/snackbar.component";

const HomePage = lazy(() => import("./pages/homepage/homepage.component"))
const SignInPage = lazy(() => import("./pages/signinpage/signinpage.component"))
const DashboardPage = lazy(() => import("./pages/dashboardpage/dashboardpage.component"))
const PoPage = lazy(() => import("./pages/popage/popage.component"))
const RegisterPage = lazy(() => import("./pages/registerpage/registerpage.component"))
const PayoutPage = lazy(() => import("./pages/payoutpage/payoutpage.component"))
const UserManagementPage = lazy(() => import("./pages/employeeMngPage/employeeManagementPage.component"))
const UserProfilePage = lazy(() => import("./pages/userProfilePage/userprofilePage.component"))

const App = () => {
    const currentUser = useSelector(selectCurrentUser)
    const dispatch = useDispatch()

    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                getDoc(doc(db, "users", user.uid))
                    .then((r) => {
                        dispatch(setCurrentUser({id: user.uid, ...user, ...r.data()}))
                    })
            } else {
                dispatch(setCurrentUser(user))
            }
        })
    }, [dispatch])

    const getUserRole = () => {
        try {
            return currentUser.role
        } catch (e) {
            return ""
        }
    }

    return (
        <div className="App" id="app">
            <CustomSnackBar/>
            <Switch>
                <ErrorBoundary>
                    <Suspense fallback={<IsLoadingSpinner/>}>
                        <Route exact path="/" component={HomePage}/>
                        <Route path="/sign-in"
                               render={() => currentUser ? <Redirect to="/dashboard"/> : <SignInPage/>}/>
                        <Route path="/dashboard"
                               render={() => currentUser ? <DashboardPage/> : <Redirect to="/sign-in"/>}/>
                        <Route path="/po-manager"
                               render={() => currentUser ? (<PoPage/>) : (<Redirect to="/sign-in"/>)}/>
                        <Route path="/register"
                               render={() => currentUser ? (<RegisterPage/>) : (<Redirect to="/sign-in"/>)}/>
                        <Route path="/profile"
                               render={() => currentUser ? (<UserProfilePage/>) : (<Redirect to="/sign-in"/>)}/>
                        <Route path="/payouts"
                               render={() => (getUserRole() === "owner") ? (<PayoutPage/>) : (
                                   <Redirect to="/sign-in"/>)}/>
                        <Route path="/employee"
                               render={() => (getUserRole() === "owner") ? (<UserManagementPage/>) : (
                                   <Redirect to="/sign-in"/>)}/>
                    </Suspense>
                </ErrorBoundary>
            </Switch>
        </div>
    );
}

export default App
