import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { animated, interpolate } from "react-spring/hooks";
import moodColorCode from "../moodColorCode";
// import Carousel from "nuka-carousel";

class Card extends React.Component {
  render() {
    const { i, x, y, rot, scale, trans, bind, data } = this.props;
    const { name, description, pics } = data[i];
    // console.log(moodColorCode[name]);
    return (
      <animated.div
        className="animated-mood-card"
        key={i}
        style={{
          transform: interpolate(
            [x, y],
            (x, y) => `translate3d(${x}px,${y}px,0)`
          )
        }}
      >
        <animated.div
          className="secondary-animated-mood-card"
          {...bind(i)}
          style={{
            transform: interpolate([rot, scale], trans)
            // borderStyle: "solid",
            // borderColor: moodColorCode[name],
            // borderWidth: "0px 1px 5px 1px"
          }}
        >
          <div className="">
            {/* <Carousel withoutControls> */}
            {pics.map((pic, index) => (
              <img
                src={pic}
                key={index}
                alt="profilePicture"
                className="feed-card-img"
              />
            ))}
            {/* </Carousel>  */}
            <h2>{name}</h2>
            <h5>{description}</h5>
            {/* <h5>{distance}</h5> */}
            {/* <h5>{text}</h5> */}
          </div>
        </animated.div>
      </animated.div>
    );
  }
}

Card.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  distance: PropTypes.string,
  text: PropTypes.string,
  pics: PropTypes.array
};

export default Card;
