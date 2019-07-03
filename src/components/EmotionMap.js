import React, { Component } from "react";
import ReactMapboxGl, {
  Marker,
  Layer,
  Feature,
  Image as MapImage
} from "react-mapbox-gl";
import { geolocated } from "react-geolocated";
import data from "../data";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoidHVydXR1cGEiLCJhIjoiY2pyeDlubnI0MGo4dzN6bHh6dHd1eXMyYSJ9.LzJY9l4E1kBtSXQSoPhS9A"
});

const images = [
  data.map(mood => {
    const image = new Image(20, 20);
    image.src = `${__dirname}emojii/${mood}.svg`;
    return [mood.name, image];
  })
];

const icons = {};
data.forEach(mood => {
  const image = new Image(20, 20);
  image.src = `${__dirname}emojii/${mood}.svg`;
  icons[mood.name] = [mood.name, image];
});

const emojii = {};
data.forEach(mood => {
  emojii[mood.name] = `${__dirname}emojii/${mood.name}.svg`;
});

class Geomap extends Component {
  renderEmojiiOnMap = () => {
    // RENDER FEEDBACKS WITH LOCATION
    const filteredFeedsWithGeolocation = this.props.feeds.filter(feed => {
      return feed.location;
    });

    return filteredFeedsWithGeolocation.map((feed, index) => {
      return (
        <Feature
          key={index}
          properties={{
            image: "Happy"
          }}
          coordinates={[feed.location.longitude, feed.location.latitude]}
        >
          <MapImage id="Happy" url="./emojii/Happy.svg" />
        </Feature>
      );
    });
  };

  renderEmojiiMarkers = () => {
    return this.props.feeds
      .filter(feed => feed.location)
      .map((feed, index) => {
        console.log("feedWithLocation: ", feed, index);
        return (
          <Marker
            key={index}
            coordinates={[feed.location.longitude, feed.location.latitude]}
            anchor="bottom"
          >
            <img src={emojii[feed.mood]} className="geomap-marker" />
          </Marker>
        );
      });
  };

  render() {
    // FIRST GEOLOCATION
    !this.props.isGeolocationAvailable
      ? console.log("Your browser does not support Geolocation")
      : !this.props.isGeolocationEnabled
      ? console.log("Geolocation is not enabled")
      : this.props.coords
      ? console.log(this.props.coords.latitude, this.props.coords.longitude)
      : console.log("Getting the location data");

    const defaultLatitude = 41.3851;
    const defaultLongitude = 2.1734;
    return (
      <div>
        <Map
          zoom={[10]}
          center={
            this.props.coords
              ? [this.props.coords.longitude, this.props.coords.latitude]
              : [defaultLongitude, defaultLatitude]
          }
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
        >
          {this.renderEmojiiMarkers()}
          {/* <Layer
            // key={index}
            type="symbol"
            id="marker"
            layout={{
              // "icon-size": true,
              "icon-image": "{image}",
              "icon-allow-overlap": true
            }}
            // images={images}
          >
            {this.renderEmojiiOnMap()}
          </Layer> */}
        </Map>
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
})(Geomap);
