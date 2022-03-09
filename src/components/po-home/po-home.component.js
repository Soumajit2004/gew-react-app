import {Grow, Stack} from "@mui/material";
import React from "react";
import RecentPo from "../recent-PO/recentPo.component";
import PoSearch from "../po-search/poSearch.component";

const PoHome = () => {
    return (
        <Grow in>
            <Stack spacing={4} style={{width: "100%", justifyContent: "center"}}>
                <PoSearch/>
                <RecentPo/>
            </Stack>
        </Grow>
    )
}

export default PoHome