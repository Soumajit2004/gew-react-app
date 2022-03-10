import {Button, Fade, Stack, TextField} from "@mui/material";
import {Add, Search} from "@mui/icons-material";
import React from "react";
import {fetchPo, setAddMode, setSearchText} from "../../redux/po/po.actions.";
import {selectPoSearch} from "../../redux/po/po.selectors.";
import {connect} from "react-redux";

const PoSearch = ({searchText, setSearchText, setAddMode, fetchPo}) => {
    return <Fade in>
        <Stack direction="row" spacing={2}>
            <TextField
                hiddenLabel
                id="filled-hidden-label-normal"
                placeholder="Search P.O"
                value={searchText}
                variant="filled"
                fullWidth={true}
                onChange={(e) => {
                    setSearchText(e.target.value)
                }}
            />
            <Button variant="contained" onClick={fetchPo}>
                <Search/>
            </Button>
            <Button variant="contained" onClick={() => {
                setAddMode(true)
            }}>
                <Add/>
            </Button>
        </Stack>
    </Fade>
}

const mapStateToProps = (state) => ({
    searchText: selectPoSearch(state),
})

const mapDispatchToProps = dispatch => ({
    fetchPo: () => dispatch(fetchPo()),
    setSearchText: text => dispatch(setSearchText(text)),
    setAddMode: bool => dispatch(setAddMode(bool))
})

export default connect(mapStateToProps, mapDispatchToProps)(PoSearch)