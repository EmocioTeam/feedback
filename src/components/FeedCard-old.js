import React, { Component } from "react";
import { Card, ButtonToolbar, Button } from "react-bootstrap";

export default class FeedCard extends Component {
  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Text>
            <strong>Winnie the Pood</strong>
            <br />
            <span
              style={{ fontWeight: "medium", fontSize: "80%", color: "grey" }}
            >
              2:58 PM - 4 Oct 2018
            </span>
          </Card.Text>
          <Card.Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero
            inventore, iste quas libero eius? Vitae sint neque animi alias sunt
            dolor, accusantium ducimus, non placeat voluptate.
          </Card.Text>
          <ButtonToolbar>
            <Button style={{ marginRight: "10px" }} variant="secondary">
              Like
            </Button>
            <Button variant="primary">Love it!</Button>
          </ButtonToolbar>
        </Card.Body>
      </Card>
    );
  }
}
