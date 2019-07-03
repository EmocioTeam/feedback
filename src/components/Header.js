import React, { Component, Fragment } from "react";
import { Navbar, Form, Nav, Button } from "react-bootstrap";

export default class Header extends Component {
  renderNavTabs = () => {
    if (this.props.navtabs) {
      return this.props.navtabs.map(tab => {
        return (
          <Nav.Link
            href=""
            key={tab.name}
            onClick={() => this.props.handleState(tab.value)}
          >
            {tab.label}
          </Nav.Link>
        );
      });
    }
    return "";
  };

  render() {
    return (
      <Fragment>
        <Navbar
          // bg="dark"
          variant="light"
          className="top-navbar"
        >
          <Navbar.Brand className="header-brand">Emocio</Navbar.Brand>
          {this.renderNavTabs()}
          <Form inline>
            <span style={{ float: "right" }}>Icon</span>
          </Form>
        </Navbar>
      </Fragment>
    );
  }
}
