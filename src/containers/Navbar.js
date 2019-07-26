import React, { Component } from "react";
import { Navbar, Nav, Image, Container } from "react-bootstrap";
import AddIcon from "../icons/add.svg";
import BarchartIcon from "../icons/barchart.svg";
import FeedIcon from "../icons/feed.svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getFeedPageTab } from "../actions/feedPageTab";

const items = [
  {
    name: "Feed",
    element: "FeedPage",
    src: FeedIcon,
    size: "45px",
    url: "feed-page"
  },
  {
    name: "+",
    element: "AddFeedback",
    src: AddIcon,
    size: "50px",
    url: "add-feed"
  },
  {
    name: "Results",
    element: "Results",
    src: BarchartIcon,
    size: "45px",
    url: "analytics"
  }
  // { name: "Inbox", element: "Inbox" },
  // { name: "Account", element: "Account" }
];

const active = {
  filter: "opacity(0.2)"
};

class BottomNavBar extends Component {
  state = {
    currentPage: window.location.pathname
  };

  NavLink = ({ element, name, src, size, url }, index) => {
    const activeStyle = window.location.pathname !== `/${url}/` ? active : {};

    return (
      <Link key={element} to={`/${url}/`} style={activeStyle}>
        <Nav.Link
          key={element}
          name={element}
          className="nav-item"
          onClick={e => {
            this.props.getFeedPageTab("wall");
            this.setState({ currentPage: `/${url}/` });
          }}
          eventKey={`link-${index}`}
          as={Image}
          src={src}
          style={{ height: size }}
        />
      </Link>
    );
  };
  render() {
    return (
      <Navbar
        fixed="bottom"
        className="bottom-navbar"
        style={this.props.hideKeyboard ? { display: "none" } : {}}
      >
        <Nav className="navbar-items">
          {items.map((item, index) => this.NavLink(item, index))}
        </Nav>
      </Navbar>
    );
  }
}

const mapStateToProps = state => {
  return {
    hideKeyboard: state.hideKeyboard
  };
};

export default connect(
  mapStateToProps,
  { getFeedPageTab }
)(BottomNavBar);
