import React from "react";
import LoadingSpinner from "./isLoadingSpinner";

const withSpinner = WrappedComponent => {
    const Spinner = ({isLoading, ...otherProps}) => {

        return isLoading ?
            (
                <LoadingSpinner/>
            ) : (
                <WrappedComponent isLoading={isLoading} {...otherProps}/>
            )
    }
    return Spinner
}

export default withSpinner