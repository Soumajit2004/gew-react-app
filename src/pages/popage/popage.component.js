import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {Container} from "@mui/material";
import "./popage.styles.scss"
import PoViewBody from "../../components/po-body/po-body.component";
import {useSelector} from "react-redux";
import PoEditAdd from "../../components/po-edit-add/poEditAdd.component";
import {selectPoAdd, selectPoEdit, selectPoView} from "../../redux/po/po.selectors.";
import PoHome from "../../components/po-home/po-home.component";

const PoPage = () => {
    const addMode = useSelector(selectPoAdd)
    const editMode = useSelector(selectPoEdit)
    const viewMode = useSelector(selectPoView)

    const getBodyComponent = () => {
        if (addMode || editMode) {
            return <PoEditAdd/>
        } else if (viewMode) {
            return <PoViewBody/>
        } else {
            return <PoHome/>
        }
    }

    return (<HeaderComponent title="P.O Manager">
            <Container style={{height: "100vh"}}>
                {getBodyComponent()}
            </Container>
        </HeaderComponent>)
}

export default PoPage