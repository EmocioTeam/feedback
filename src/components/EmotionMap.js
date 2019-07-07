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
  const newEmojii = new Image(25, 25);
  newEmojii.src = `${__dirname}emojii/${mood.name}.svg`;
  emojii[mood.name] = [mood.name, newEmojii];
});

class Geomap extends Component {
  renderEmojiiLayer = () => {
    // RENDER FEEDBACKS WITH LOCATION
    const filteredFeedsWithGeolocation = this.props.feeds.filter(feed => {
      return feed.location;
    });

    return data.map(mood => {
      return (
        <Layer
          type="symbol"
          layout={{ "icon-image": mood.name, "icon-allow-overlap": true }}
          key={mood.name}
          images={emojii[mood.name]}
        >
          {filteredFeedsWithGeolocation
            .filter(feed => feed.mood === mood.name)
            .map((feed, index) => {
              return (
                <Feature
                  key={index}
                  coordinates={[
                    feed.location.longitude,
                    feed.location.latitude
                  ]}
                />
              );
            })}
        </Layer>
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
    // !this.props.isGeolocationAvailable
    //   ? console.log("Your browser does not support Geolocation")
    //   : !this.props.isGeolocationEnabled
    //   ? console.log("Geolocation is not enabled")
    //   : this.props.coords
    //   ? console.log(this.props.coords.latitude, this.props.coords.longitude)
    //   : console.log("Getting the location data");

    const defaultLatitude = 41.3851;
    const defaultLongitude = 2.1734;
    return (
      <div>
        <Map
          zoom={[13]}
          center={
            this.props.coords
              ? [this.props.coords.longitude, this.props.coords.latitude]
              : [defaultLongitude, defaultLatitude]
          }
          style="mapbox://styles/mapbox/streets-v11?optimize=true"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
        >
          {this.renderEmojiiLayer()}
          {/* {this.renderEmojiiMarkers()} */}
        </Map>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  watchPosition: false,
  userDecisionTimeout: 5000
})(Geomap);
