import React from "react";
import "./map.styles.scss"

export class MapContainer extends React.Component {
    render() {
        return (
            <iframe
                title={"Map"}
                id={"mapBox"}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d459.66060773917!2d88.1698592054715!3d22.82894810803874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x876b686319db9cdc!2sGhosh%20Electrical%20Work!5e0!3m2!1sen!2sin!4v1648136825300!5m2!1sen!2sin"
                width="100%" height={"100%"}/>
        );
    }
}