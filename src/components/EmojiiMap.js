import React, { Component } from "react";
import { geolocated } from "react-geolocated";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class EmojiiMap extends Component {
  static defaultProps = {
    center: {
      lat: 40.95,
      lng: -2.33
    },
    zoom: 11
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  },
  watchPosition: false,
  userDecisionTimeout: 5000
})(EmojiiMap);
