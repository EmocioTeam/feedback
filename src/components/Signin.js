import React, { Component } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { signIn } from "../actions/firebaseActions";

class Signin extends Component {
  state = {
    email: "",
    password: ""
  };

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.signIn(this.state.email, this.state.password);
  };

  render() {
    const { email, password } = this.state;
    return (
      <Container className="profile-container">
        <Form onSubmit={e => this.handleSubmit(e)}>
          <h3>Please sign in</h3>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              name="email"
              onChange={e => this.handleInput(e)}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={e => this.handleInput(e)}
            />
            <Form.Text className="text-muted">
              {password.length < 6 ? "Min password characters is 6" : ""}
            </Form.Text>
          </Form.Group>
          <Button
            disabled={email.length <= 0 || password.length < 6}
            variant="primary"
            type="submit"
            block
          >
            Submit
          </Button>
          <Form.Text className="text-muted">
            {this.props.auth.errorMsg}
          </Form.Text>
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return { auth: state.auth };
};

export default connect(
  mapStateToProps,
  { signIn }
)(Signin);
