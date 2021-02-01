import React, { Component } from "react";
import ReactMapboxGl, {
  Marker,
  Layer,
  Feature,
  Image as MapImage,
  ZoomControl,
  Popup,
  RotationControl
} from "react-mapbox-gl";
import { geolocated } from "react-geolocated";
import data from "../data";
import FeedCard from "./FeedCard";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoidHVydXR1cGEiLCJhIjoiY2pyeDlubnI0MGo4dzN6bHh6dHd1eXMyYSJ9.LzJY9l4E1kBtSXQSoPhS9A"
});

const emojii = {};
data.forEach(mood => {
  const newEmojii = new Image(25, 25);
  newEmojii.src = `${__dirname}emojii/${mood.name}.svg`;
  emojii[mood.name] = [mood.name, newEmojii];
});

class Geomap extends Component {
  state = {
    showCard: false,
    selectedEmojii: false,
    mapCenter: false
  };

  renderEmojiiLayer = () => {
    return data.map(mood => {
      return (
        <Layer
          type="symbol"
          layout={{ "icon-image": mood.name, "icon-allow-overlap": true }}
          key={mood.name}
          images={emojii[mood.name]}
        >
          {this.props.feeds &&
            this.props.feeds
              .filter(feed => feed.mood === mood.name)
              .map((feed, index) => {
                return (
                  <Feature
                    onClick={e => {
                      this.setState({
                        showCard: true,
                        selectedEmojii: feed,
                        mapCenter: [
                          feed.location.longitude,
                          feed.location.latitude
                        ]
                      });
                    }}
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

  closeCard = () => {
    this.setState({ showCard: false });
  };

  componentDidMount = () => {
    // this.props.getFeedWithLocation();
  };

  render() {
    const defaultLatitude = 41.3851;
    const defaultLongitude = 2.1734;
    return (
      <div>
        {/* UNCOMMENT THIS TO SHOW COMMENTS ON MAP */}
        {this.state.showCard && this.state.selectedEmojii && (
          <div className="emotion-map-comment-card">
            <FeedCard
              feed={this.state.selectedEmojii}
              showActions={false}
              closeCard={this.closeCard}
            />
          </div>
        )} 
        <div className="emotion-map-container">
          <Map
            zoom={[15]}
            center={
              this.state.mapCenter
                ? this.state.mapCenter
                : this.props.coords
                ? [this.props.coords.longitude, this.props.coords.latitude]
                : [defaultLongitude, defaultLatitude]
            }
            style="mapbox://styles/mapbox/basic-v8"
            containerStyle={{
              height: "100vh",
              width: "100vw"
            }}
          >
            {this.renderEmojiiLayer()}
            <RotationControl
              position="bottom-right"
              style={{ marginBottom: "60px" }}
            />
            <ZoomControl
              position="bottom-right"
              style={{ marginBottom: "160px" }}
            />
          </Map>
        </div>
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

// const images = [
//   data.map(mood => {
//     const image = new Image(20, 20);
//     image.src = `${__dirname}emojii/${mood}.svg`;
//     return [mood.name, image];
//   })
// ];

// const icons = {};
// data.forEach(mood => {
//   const image = new Image(20, 20);
//   image.src = `${__dirname}emojii/${mood}.svg`;
//   icons[mood.name] = [mood.name, image];
// });

// renderEmojiiMarkers = () => {
//   return this.props.feeds
//     .filter(feed => feed.location)
//     .map((feed, index) => {
//       console.log("feedWithLocation: ", feed, index);
//       return (
//         <Marker
//           key={index}
//           coordinates={[feed.location.longitude, feed.location.latitude]}
//           anchor="bottom"
//         >
//           <img src={emojii[feed.mood]} className="geomap-marker" />
//         </Marker>
//       );
//     });
// };
