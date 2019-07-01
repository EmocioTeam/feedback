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
          <Navbar.Brand className="header-brand">
            <span className="header-brand-button">{this.props.header}</span>
            {this.props.secondaryHeader && (
              <span className="header-brand-button">
                {this.props.secondaryHeader}
              </span>
            )}
          </Navbar.Brand>
        </Navbar>
      </Fragment>
    );
  }
}
