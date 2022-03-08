import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {Container} from "@mui/material";
import "./popage.styles.scss"
import PoViewBody from "../../components/po-body/po-body.component";
import {connect} from "react-redux";
import PoEditAdd from "../../components/po-edit-add/poEditAdd.component";
import {selectPoAdd, selectPoEdit, selectPoSearch, selectPoView} from "../../redux/po/po.selectors.";
import PoHome from "../../components/po-home/po-home.component";

class PoPage extends React.Component {

    getBodyComponent = () => {
        const {addMode, editMode, viewMode} = this.props
        if (addMode || editMode) {
            return <PoEditAdd/>
        } else if (viewMode) {
            return <PoViewBody/>
        } else {
            return <PoHome/>
        }
    }

    // eslint-disable-next-line react/require-render-return
    render() {
        return (
            <HeaderComponent title="P.O Manager">
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

export default connect(mapStateToProps, null)(PoPage)