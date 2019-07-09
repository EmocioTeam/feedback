import React, { Component } from "react";
import { Navbar, Nav, Image } from "react-bootstrap";
import AddIcon from "../icons/add.svg";
import BarchartIcon from "../icons/barchart.svg";
import FeedIcon from "../icons/feed.svg";
import { Link } from "react-router-dom";

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

export default class NavBar extends Component {
  NavLink = ({ element, name, src, size, url }, index) => {
    return (
      <Link key={element} to={`/${url}/`}>
        <Nav.Link
          key={element}
          name={element}
          className="nav-item"
          // onClick={e => this.props.changeTab(e)}
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
      <Navbar fixed="bottom" className="bottom-navbar">
        <Nav className="navbar-items">
          {items.map((item, index) => this.NavLink(item, index))}
        </Nav>
      </Navbar>
    );
  }
}
