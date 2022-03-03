import React from "react";
import HeaderComponent from "../../components/header/header.component";
import {Container} from "@mui/material";
import {customGetPoDoc} from "../../firebase/firebase.utils";
import "./popage.styles.scss"
import PoViewBody from "../../components/po-body/po-body.component";
import {setPoData, toggleViewMode} from "../../redux/po/po.actions.";
import {connect} from "react-redux";
import PoEditAdd from "../../components/po-edit-add/poEditAdd.component";
import {selectPoAdd, selectPoEdit, selectPoSearch, selectPoView} from "../../redux/po/po.selectors.";
import PoHome from "../../components/po-home/po-home.component";
import {showMessage} from "../../redux/snackbar/snackbar.actions";

class PoPage extends React.Component {

    handleSearch = async () => {
        const {searchText, setPoData, viewMode, toggleViewMode, showMessage} = this.props

        if (searchText) {
            try {
                const response = await customGetPoDoc(searchText.toString())

                const data = response.data()
                if (data) {
                    setPoData({poNumber: response.id, ...data})

                    if (!viewMode) {
                        toggleViewMode()
                    }
                } else {
                    showMessage("P.O not Found !")
                }
            }
            catch(e){
                showMessage(e.toString())
            }
        }
    }

    getBodyComponent = () => {
        const {addMode, editMode, viewMode} = this.props
        if (addMode || editMode) {
            return <PoEditAdd/>
        } else if (viewMode) {
            return <PoViewBody handleSearch={this.handleSearch}/>
        } else {
            return <PoHome handleSearch={this.handleSearch}/>
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

const mapDispatchToProp = dispatch => ({
    setPoData: poData => dispatch(setPoData(poData)),
    toggleViewMode: () => dispatch(toggleViewMode()),
    showMessage: message => dispatch(showMessage(message))
})

export default connect(mapStateToProps, mapDispatchToProp)(PoPage)