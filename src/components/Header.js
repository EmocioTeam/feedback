import React, { Component, Fragment } from "react";
import { Navbar } from "react-bootstrap";

export default class Header extends Component {
  render() {
    return (
      <Fragment>
        <Navbar
          // bg="dark"
          variant="light"
          className="top-navbar"
        >
          <Navbar.Brand>{this.props.header}</Navbar.Brand>
        </Navbar>
      </Fragment>
    );
  }
}
