import React, { Component } from "react";
import { signOut } from "../actions/firebaseActions";
import { Container, Button, Form } from "react-bootstrap";
import { connect } from "react-redux";

class Signout extends Component {
  render() {
    return (
      <Container className="profile-container">
        <Form>
          <h3>Sign Out</h3>
          <Form.Text>
            Sign out if you wanna miss the awesome power of Emocio!
          </Form.Text>
          <Button
            onClick={() => {
              this.props.signOut();
            }}
            variant="primary"
            block
          >
            Sign Out
          </Button>
        </Form>
      </Container>
    );
  }
}

export default connect(
  null,
  { signOut }
)(Signout);
