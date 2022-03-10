import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
    AccountCircle,
    AppRegistration,
    Dashboard,
    Logout,
    Pages,
    Payment,
    VerifiedUserRounded
} from "@mui/icons-material";
import {withRouter} from "react-router";
import {auth} from "../../firebase/firebase.utils";
import {Button, Fade, Stack} from "@mui/material";
import {connect} from "react-redux";
import {selectCurrentUser} from "../../redux/user/user.selector";


const drawerWidth = 220;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const HeaderComponent = ({title, children, history, currentUser}) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const redirectTo = (path) => {
        if (history.location.pathname !== path) {
            history.push(path)
        }
    }

    const signOut = () => {
        auth.signOut()
            .then(() => redirectTo("/sign-in"))
    }

    return (
        <Fade in>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{mr: 2, ...(open && {display: 'none'})}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            {title}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="secondary" startIcon={<AccountCircle/>}>
                                {currentUser.name}
                            </Button>
                            <Button variant="contained" color="error" startIcon={<Logout/>} onClick={signOut}>
                                Sign-out
                            </Button>
                        </Stack>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                        </IconButton>
                    </DrawerHeader>
                    <Divider/>
                    <List>
                        <ListItem button key={1} onClick={() => redirectTo("/dashboard")}>
                            <ListItemIcon>
                                <Dashboard/>
                            </ListItemIcon>
                            <ListItemText primary="Dashboard"/>
                        </ListItem>
                        <ListItem button key={2} onClick={() => redirectTo("/po-manager")}>
                            <ListItemIcon>
                                <Pages/>
                            </ListItemIcon>
                            <ListItemText primary="P.O Manager"/>
                        </ListItem>
                        {
                            (currentUser.role === "owner") ? (
                                <ListItem button key={3} onClick={() => {
                                    redirectTo("/payouts")
                                }}>
                                    <ListItemIcon>
                                        <Payment/>
                                    </ListItemIcon>
                                    <ListItemText primary="Payouts"/>
                                </ListItem>
                            ) : <div/>
                        }
                    </List>
                    <Divider/>
                    <List>
                        <ListItem button key={4} onClick={() => redirectTo("/register")}>
                            <ListItemIcon>
                                <AppRegistration/>
                            </ListItemIcon>
                            <ListItemText primary="Register"/>
                        </ListItem>
                    </List>
                    <Divider/>
                    <List>
                        <ListItem button key={5} onClick={signOut}>
                            <ListItemIcon>
                                <Logout/>
                            </ListItemIcon>
                            <ListItemText primary="Logout"/>
                        </ListItem>
                    </List>
                </Drawer>
                <Main open={open}>
                    <DrawerHeader/>
                    {children}
                </Main>
            </Box>
        </Fade>
    );
}

const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state),
})

export default connect(mapStateToProps, null)(withRouter(HeaderComponent))