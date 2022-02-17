import * as React from "react";
import {
    Button,
    Divider,
    Grid,
    Grow,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import "./poEditAdd.styles.scss"
import {Add, CancelOutlined, Close, Delete, Save} from "@mui/icons-material";
import Box from "@mui/material/Box";
import {doc, setDoc, Timestamp, updateDoc} from "firebase/firestore";
import {customGetPoDoc, db} from "../../firebase/firebase.utils";
import {connect} from "react-redux";
import {parseDate} from "../../utilils/functions.utilis";
import {selectCurrentUser} from "../../redux/user/user.selector";
import {
    selectPoAdd,
    selectPoData,
    selectPoEdit, selectPoView
} from "../../redux/po/po.selectors.";
import {setPoData, toggleAddMode, toggleEditMode, toggleViewMode} from "../../redux/po/po.actions.";
import LoadingSpinner from "../withSpinner/isLoadingSpinner";


class PoEditAdd extends React.Component {
    constructor(props) {
        super(props);

        const {editMode, poData: {poNumber, issueNo, poDate, issueDate, description, material}} = this.props

        // converting from firebase format to local format
        let initMat = []
        for (let i in material) {
            initMat.push({matName: i, quantity: material[i][0], unit: material[i][1]})
        }

        this.state = {
            snackbarOpen: false,
            snackbarMessage: "",
            rows: editMode ? initMat : [{matName: "", quantity: "", unit: ""}],
            poNumber: editMode ? poNumber : "",
            issueNumber: editMode ? issueNo : "",
            poDate: editMode ? poDate : new Date(),
            issueDate: editMode ? issueDate : new Date(),
            description: editMode ? description : "",
            isLoading: false
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

    toggleLoading = () => {
        this.setState({isLoading: !this.state.isLoading})
    }

    validateFields = () => {
        const {poNumber, issueNumber, poDate, issueDate, description, rows} = this.state

        if (poNumber !== "" && issueNumber !== "" && poDate !== "" && issueDate !== "" && description !== "") {
            for (let i in rows) {
                let {matName, quantity, unit} = rows[i]
                if (matName === "" || quantity === "" || unit === "") {
                    return false
                }
            }
            return true
        } else {
            return false
        }
    }

    refreshPoDetails = (poNumber, callback) => {
        const {setPoData} = this.props

        customGetPoDoc(poNumber)
            .then((e) => {
                const data = e.data()
                if (data) {
                    setPoData({poNumber: e.id, ...data})
                }

                callback()
            })
    }

    handleSave = async () => {
        const {poNumber, issueNumber, poDate, issueDate, description, rows} = this.state
        const {editMode, viewMode, addMode, currentUser: {name}, toggleEditMode, toggleAddMode} = this.props

        // validating fields
        if (this.validateFields()) {

            // loading state: true
            this.toggleLoading()

            // converting to firebase format
            let materials = {}
            rows.forEach(({matName, quantity, unit}) => {
                materials[matName] = [quantity, unit]
            })

            let docRef = doc(db, "po", poNumber)
            if (addMode) {
                // creating new firebase doc
                try {
                    await setDoc(docRef, {
                        issueNo: issueNumber,
                        issueDate: Timestamp.fromDate(issueDate),
                        poDate: Timestamp.fromDate(poDate),
                        description: description,
                        material: materials,
                        lastEditedBy: name,
                        lastEditedTime: Timestamp.fromDate(new Date())
                    })

                    viewMode ? this.refreshPoDetails(poNumber, toggleAddMode) : toggleAddMode()
                } catch (e) {
                    this.showError("Failed to add P.O")
                }
            } else if (editMode) {
                // updating existing doc
                try{
                    await updateDoc(docRef, {
                        issueNo: issueNumber,
                        issueDate: Timestamp.fromDate(issueDate),
                        poDate: Timestamp.fromDate(poDate),
                        description: description,
                        material: materials,
                        lastEditedBy: name,
                        lastEditedTime: Timestamp.fromDate(new Date())
                    })

                    this.refreshPoDetails(poNumber, toggleEditMode)
                }catch(e){
                    this.showError(e.toString())
                }
            }

            // loading state: false
            this.toggleLoading()


        } else {
            this.showError("Invalid Data")
        }
    }

    render() {
        const {poNumber, issueNumber, poDate, issueDate, description, rows, isLoading} = this.state
        const {editMode, toggleEditMode, toggleAddMode} = this.props

        return <Grow in>
            {
                isLoading ? (<LoadingSpinner/>) : (
                    <Paper elevation={6} style={{overflowY: "scroll"}}>
                        <Stack>
                            <Snackbar open={this.state.snackbarOpen}
                                      action={this.snackbarAction}
                                      autoHideDuration={6000}
                                      message={this.state.snackbarMessage}
                                      style={{color: "white"}}
                                      onClose={() => {
                                          this.setState({snackbarOpen: false})
                                      }}
                            />
                            <Grid container spacing={2} padding={2}>
                                <Grid item sm={12} md={6}>
                                    <div style={{display: "flex", alignItems: "flex-end"}}>
                                        <Typography variant="h4">
                                            {editMode ? ("Edit P.O") : ("Add P.O")}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        gap: "10px"
                                    }}>
                                        <Button variant="contained" startIcon={<Save/>} style={{height: 40}}
                                                onClick={this.handleSave}>
                                            Save
                                        </Button>
                                        <Button variant="outlined" startIcon={<CancelOutlined/>} style={{height: 40}}
                                                onClick={editMode ? toggleEditMode : toggleAddMode}>
                                            Cancel
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                            <Divider/>
                            <Grid container spacing={2} padding={2}>
                                <Grid item sm={12} md={6} style={{width: "100%"}}>
                                    <Stack spacing={2}>
                                        <TextField id="filled-basic" label="P.O Number" variant="outlined"
                                                   value={poNumber}
                                                   disabled={editMode}
                                                   onChange={(e) => {
                                                       this.setState({poNumber: e.target.value})
                                                   }}
                                                   fullWidth
                                        />
                                        <TextField id="filled-basic" label="Memo Number" variant="outlined"
                                                   value={issueNumber}
                                                   onChange={(e) => {
                                                       this.setState({issueNumber: e.target.value})
                                                   }}
                                        />
                                        <div className="date-div">
                                            <label htmlFor="poDate">P.O Date</label>
                                            <input id="poDate" value={parseDate({date: poDate, reverse: true})}
                                                   type="date" className="date-picker"
                                                   onChange={(e) => {
                                                       this.setState({poDate: new Date(e.target.value)})
                                                   }}/>
                                        </div>
                                        <div className="date-div">
                                            <label htmlFor="memoDate">Memo Date</label>
                                            <input id="memoDate" value={parseDate({date: issueDate, reverse: true})}
                                                   type="date"
                                                   className="date-picker"
                                                   onChange={(e) => {
                                                       this.setState({issueDate: new Date(e.target.value)})
                                                   }}
                                            />
                                        </div>
                                        <TextField id="standard-textarea"
                                                   label="Description"
                                                   placeholder="Enter Description Here"
                                                   multiline
                                                   rows={18}
                                                   style={{height: "50%"}}
                                                   variant="outlined"
                                                   value={description}
                                                   onChange={(e) => {
                                                       this.setState({description: e.target.value})
                                                   }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item sm={12} md={6}>
                                    <Stack spacing={2}>
                                        <Box style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between"
                                        }}>
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <Typography variant="h5">Materials</Typography>
                                            </div>
                                            <IconButton onClick={() => {
                                                let newRows = rows
                                                newRows.push({matName: "", quantity: "", unit: ""})
                                                this.setState({rows: newRows})
                                            }}>
                                                <Add/>
                                            </IconButton>
                                        </Box>
                                        <div className="materials-table">
                                            {rows.map((e) => {
                                                    let newValue = e
                                                    let newRows = rows
                                                    let index = newRows.indexOf(e)

                                                    return <div key={index}>
                                                        <TextField style={{flex: 4}} fullWidth id="outlined-basic"
                                                                   label="Material Name"
                                                                   variant="outlined" size="small" value={e.matName}
                                                                   onChange={(element) => {
                                                                       newValue.matName = element.target.value
                                                                       newRows[index] = newValue
                                                                       this.setState({rows: newRows})
                                                                   }}/>
                                                        <TextField style={{flex: 2}} id="outlined-basic" label="Quantity"
                                                                   variant="outlined" size="small" value={e.quantity}
                                                                   onChange={(element) => {
                                                                       newValue.quantity = element.target.value
                                                                       newRows[index] = newValue
                                                                       this.setState({rows: newRows})
                                                                   }
                                                                   }/>
                                                        <TextField style={{flex: 1}} id="outlined-basic" label="Unit"
                                                                   variant="outlined"
                                                                   size="small" value={e.unit}
                                                                   onChange={(element) => {
                                                                       newValue.unit = element.target.value
                                                                       newRows[index] = newValue
                                                                       this.setState({rows: newRows})
                                                                   }
                                                                   }/>
                                                        <IconButton
                                                            onClick={() => {
                                                                newRows.splice(index, 1)
                                                                this.setState({rows: newRows})
                                                            }}>
                                                            <Delete/>
                                                        </IconButton>
                                                    </div>
                                                }
                                            )}
                                        </div>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Paper>
                )
            }
        </Grow>
    }
}

const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state),
    poData: selectPoData(state),
    addMode: selectPoAdd(state),
    editMode: selectPoEdit(state),
    viewMode: selectPoView(state)
})

const mapDispatchToProps = dispatch => ({
    setPoData: po => dispatch(setPoData(po)),
    toggleViewMode: () => dispatch(toggleViewMode()),
    toggleEditMode: () => dispatch(toggleEditMode()),
    toggleAddMode: () => dispatch(toggleAddMode())
})

export default connect(mapStateToProps, mapDispatchToProps)(PoEditAdd)
