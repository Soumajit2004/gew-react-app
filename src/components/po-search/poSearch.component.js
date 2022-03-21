import {Button, Fade, Stack, TextField} from "@mui/material";
import {Add, Search} from "@mui/icons-material";
import React from "react";
import {fetchPo, setAddMode, setSearchText} from "../../redux/po/po.actions.";
import {selectPoSearch} from "../../redux/po/po.selectors.";
import {connect, useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";

const PoSearch = () => {

    const searchText = useSelector(selectPoSearch)
    const dispatch = useDispatch()

    const handleSearch = (event) => {
        event.preventDefault()
        const data = new FormData(event.target)
        dispatch(setSearchText(data.get("search")))
        dispatch(fetchPo())
    }

    return <Fade in>
        <Box component="form" onSubmit={handleSearch}>
            <Stack direction="row" spacing={2}>
                <TextField
                    hiddenLabel
                    placeholder="Search P.O"
                    name="search"
                    defaultValue={searchText}
                    variant="filled"
                    fullWidth={true}
                />
                <Button variant="contained" type="submit">
                    <Search/>
                </Button>
                <Button variant="contained" onClick={() => {
                    dispatch(setAddMode(true))
                }}>
                    <Add/>
                </Button>
            </Stack>
        </Box>
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