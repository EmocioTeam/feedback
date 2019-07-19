import React, { Component, Fragment } from "react";
import { Navbar, Nav, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProfileIcon from "../icons/user.svg";
import { connect } from "react-redux";
import { getAllFeeds } from "../actions/firebaseActions";

class Header extends Component {
  renderNavTabs = () => {
    if (this.props.navtabs) {
      return this.props.navtabs.map(tab => {
        return (
          <Nav.Link
            href=""
            key={tab.name}
            onClick={() => this.props.handleState(tab.value)}
          >
            {tab.icon ? (
              <Nav.Item
                as={Image}
                src={tab.icon}
                style={{ height: "25px", cursor: "pointer" }}
              />
            ) : (
              tab.label
            )}
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
          <Nav className="mr-auto">
            <Navbar.Brand
              onClick={() => {
                // this.props.getAllFeeds();
              }}
              className="header-brand"
            >
              Emocio
            </Navbar.Brand>
            {this.renderNavTabs()}
          </Nav>
          <Nav>
            <Link to="/profile">
              <Nav.Item
                as={Image}
                src={ProfileIcon}
                style={{ height: "25px", cursor: "pointer" }}
              />
            </Link>
          </Nav>
        </Navbar>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { getAllFeeds }
)(Header);
