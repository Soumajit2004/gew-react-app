import {Autocomplete, Button, Fade, Stack, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {fetchPo, findPo, setAddMode} from "../../redux/po/po.actions.";
import {selectIsFinding, selectMatchingPO, selectPoSearch} from "../../redux/po/po.selectors.";
import {useDispatch, useSelector} from "react-redux";

const PoSearch = () => {
    const [localSearchText, setLocalSearchText] = useState("")

    const searchText = useSelector(selectPoSearch)
    const matchingPo = useSelector(selectMatchingPO)
    const isFinding = useSelector(selectIsFinding)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(findPo({id:"",field:"poNumber"}))
    }, [dispatch])

    const handleSearch = (event) => {
        const data = event.value
        dispatch(findPo({id: data, field: "poNumber"}))
    }

    return <Fade in>
            <Stack direction="row" spacing={2}>
                <Autocomplete
                    fullWidth={true}
                    defaultValue={searchText}
                    loading={isFinding}
                    value={localSearchText}
                    renderOption={(props, option, state) => {
                        return <Button
                            key={option}
                            fullWidth
                            onClick={() => {
                                setLocalSearchText(option)
                                dispatch(fetchPo(option))
                            }}
                            style={{justifyContent: "flex-start"}}
                        >
                            {option}
                        </Button>
                    }}
                    renderInput={(params) => {
                        return <TextField
                            {...params}
                            hiddenLabel
                            placeholder="Search P.O"
                            name="search"
                            variant="outlined"
                            onChange={(event) => {
                                setLocalSearchText(event.target.value)
                                handleSearch(event.target)
                            }}
                        />
                    }}
                    options={
                        matchingPo.map((value) => {
                            return value.poNumber
                        })
                    }
                />
                <Button variant="contained" onClick={() => {
                    dispatch(setAddMode(true))
                }}>
                    <Add/>
                </Button>
            </Stack>
    </Fade>
}

export default PoSearch