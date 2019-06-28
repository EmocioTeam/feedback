import React, { Component } from "react";
import { Container, Alert, Button } from "react-bootstrap";

export default class Alerts extends Component {
  render() {
    const { data, deleteFeedback } = this.props;
    return (
      <div
        style={{
          position: "absolute",
          top: "7%",
          zIndex: 99999,
          width: "100%"
          //   display: "flex",
          //   justifyContent: "space-between"
        }}
      >
        <Alert variant={data.variant}>
          {/* <Alert.Heading> */}
          {data.msg}{" "}
          <Button
            onClick={() => deleteFeedback(data.id)}
            variant="outline-success"
          >
            UNDO
          </Button>
          {/* </div> */}
          {/* <Alert.Link href="#">
            <b >UNDO</b>
          </Alert.Link> */}
          {/* </Alert.Heading> */}
        </Alert>
      </div>
    );
  }
}
