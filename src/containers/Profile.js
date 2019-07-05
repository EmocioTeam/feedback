import React, { Component } from "react";
import Header from "../components/Header";
import Signin from "../components/Signin";
import Signout from "../components/Signout";
import { connect } from "react-redux";
import { updateUserName } from "../actions/firebaseActions";

import { Container, Form } from "react-bootstrap";

class Profile extends Component {
  state = {
    currentTab: "profile",
    newUsername: ""
  };

  getCurrentTab = tab => {
    this.setState({
      currentTab: tab
    });
  };

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { currentTab } = this.state;
    return (
      <div>
        <Header
          handleState={this.getCurrentTab}
          navtabs={[
            { label: "Messages", name: "privateMessages", value: "pMessages" },
            { label: "Stats", name: "stats", value: "stats" }
          ]}
        />
        {this.props.auth.email ? (
          <Container style={{ marginTop: "50px" }}>
            <h3>
              Welcome{" "}
              {this.props.auth.user ? this.props.auth.user : "SpookyMaster"}
            </h3>
            <Form
              onSubmit={e => {
                e.preventDefault();
                this.props.updateUserName(this.state.newUsername);
                this.setState({ newUsername: "" });
              }}
            >
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Select a new username!</Form.Label>
                <Form.Control
                  autoComplete="off"
                  type="text"
                  placeholder="Use your imagination ;)"
                  name="newUsername"
                  onChange={this.handleInput}
                  value={this.state.newUsername}
                />
                <Form.Text className="text-muted">
                  Please select a nickname not recognizable by friends /
                  colleagues
                </Form.Text>
              </Form.Group>
            </Form>
          </Container>
        ) : (
          ""
        )}
        {this.props.auth.email ? <Signout /> : <Signin />}
        <Container>
          {currentTab === "pMessages"
            ? "Private Messages under construction"
            : ""}
          {currentTab === "stats" ? "Your stats page under construction" : ""}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { updateUserName }
)(Profile);
