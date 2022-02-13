import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {Button, Container, Grow, IconButton, Snackbar, Stack, TextField, Typography} from "@mui/material";
import {customGetPoDoc} from "../../firebase/firebase.utils";
import "./popage.styles.scss"
import PoViewBody from "../../components/pobody/pobody.component";
import {Add, Close, Search} from "@mui/icons-material";
import {setPoData, setSearchText, toggleAddMode, toggleEditMode, toggleViewMode} from "../../redux/po/po.actions.";
import {connect} from "react-redux";
import PoEditAdd from "../../components/po-edit-add/poEditAdd.component";
import {selectPoAdd, selectPoEdit, selectPoSearch, selectPoView} from "../../redux/po/po.selectors.";

class PoPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbarOpen: false,
            snackbarMessage: "",
        }
    }

    snackbarAction = (
        <IconButton onClick={() => this.setState({snackbarOpen: false})} style={{color: "white"}}>
            <Close/>
        </IconButton>
    )

    showError = (message) => {
        this.setState({snackbarOpen: true, snackbarMessage: message})
    }

    handleSearch = () => {
        const {searchText, setPoData, viewMode, toggleViewMode} = this.props

        if (searchText) {

            customGetPoDoc(searchText.toString())
                .then((e) => {
                    const data = e.data()
                    if (data) {
                        setPoData({poNumber: e.id, ...data})

                        if (!viewMode){
                            toggleViewMode()
                        }
                    } else {
                        this.showError("P.O not found")
                    }
                })
                .catch((e) => {
                    this.showError(e.toString())
                })
        }
    }

    getBodyComponent = () => {
        const {setSearchText, addMode, editMode, viewMode, toggleAddMode} = this.props

        if (addMode) {
            return <PoEditAdd/>
        } else if (viewMode) {
            if (editMode) {
                return <PoEditAdd/>
            } else {
                return <PoViewBody handleSearch={this.handleSearch}/>
            }
        } else {
            return (
                <Grow in>
                        <Stack spacing={4} style={{width: "100%", height:"70%", justifyContent:"center"}}>
                            <Typography variant="h2" fontSize={60} align="center" fontWeight={500}>
                                Search P.O
                            </Typography>
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-normal"
                                placeholder="Search P.O"
                                variant="filled"
                                fullWidth
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <Stack spacing={2} direction="row" style={{justifyContent: "center"}}>
                                <Button variant="contained" onClick={this.handleSearch} startIcon={<Search/>}
                                        size="large">
                                    Search
                                </Button>
                                <Button variant="contained"
                                        startIcon={<Add/>}
                                        size="large"
                                        onClick={toggleAddMode}>
                                    Add
                                </Button>
                            </Stack>
                        </Stack>
                </Grow>
            )
        }
    }

    // eslint-disable-next-line react/require-render-return
    render() {
        return (
            <HeaderComponent title="P.O Manager">
                <Snackbar open={this.state.snackbarOpen}
                          action={this.snackbarAction}
                          autoHideDuration={6000}
                          message={this.state.snackbarMessage}
                          style={{color: "white"}}
                          onClose={() => {
                              this.setState({snackbarOpen: false})
                          }}
                />
                <Container style={{height: "100vh"}}>
                    {this.getBodyComponent()}
                </Container>
            </HeaderComponent>
        )
    }
}

const mapStateToProps = (state) => ({
    searchText: selectPoSearch(state),
    addMode: selectPoAdd(state),
    editMode: selectPoEdit(state),
    viewMode: selectPoView(state)
})

const mapDispatchToProp = dispatch => ({
    setPoData: poData => dispatch(setPoData(poData)),
    setSearchText: text => dispatch(setSearchText(text)),
    toggleViewMode: () => dispatch(toggleViewMode()),
    toggleEditMode: () => dispatch(toggleEditMode()),
    toggleAddMode: () => dispatch(toggleAddMode())
})

export default connect(mapStateToProps, mapDispatchToProp)(PoPage)