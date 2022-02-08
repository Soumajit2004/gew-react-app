import React from "react";
import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";

export const EditTextDisplay = ({editBool, data, onChange}) => {
    if (editBool) {
        return (
            <TextField
                hiddenLabel
                id="outlined-basic"
                defaultValue={data}
                variant="outlined"
                size="small"
                fullWidth={true}
                onChange={onChange}
            />)
    } else {
        return <Typography variant="h4">{data}</Typography>
    }
}

export const EditTextAreaDisplay = ({editBool, data, onChange}) => {
    if (editBool) {
        return (
            <TextField
                style={{height:"430px"}}
                id="standard-textarea"
                multiline
                rows={17}
                variant="outlined"
                fullWidth={true}
                onChange={onChange}
            />)
    } else {
        return <Typography variant="h4">{data}</Typography>
    }
}

