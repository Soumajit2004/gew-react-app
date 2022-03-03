import {Button, Grow, Stack, TextField, Typography} from "@mui/material";
import {Add, Search} from "@mui/icons-material";
import React from "react";
import {setSearchText, toggleAddMode} from "../../redux/po/po.actions.";
import {connect} from "react-redux";

const PoHome = ({setSearchText, toggleAddMode, handleSearch}) => {

    return (
        <Grow in>
            <Stack spacing={4} style={{width: "100%", height: "70%", justifyContent: "center"}}>
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
                    <Button variant="contained" onClick={handleSearch} startIcon={<Search/>}
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

const mapDispatchToProp = dispatch => ({
    setSearchText: text => dispatch(setSearchText(text)),
    toggleAddMode: () => dispatch(toggleAddMode()),
})

export default connect(null, mapDispatchToProp)(React.memo(PoHome))