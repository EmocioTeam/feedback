import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

export default class Comments extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
  }

  render() {

    const { email, comments, mood } = this.props.state;

    return (
      <>
        <Button className='btn-addFeedback' variant="secondary" onClick={this.handleShow} block>
          Send Feedback!
        </Button>

        <Modal
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Please let us know more about your day!
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => this.props.handleSubmit(e)}>
              <Form.Group controlId="formPlaintextEmail">
                <Form.Label>
                  Today you are feeling <b>happy!</b>
                </Form.Label>
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={this.props.handleInput}
                  name="email"
                />
                <Form.Text className="text-muted">
                  This field is totally optional. If you want to keep your anonymity please do not fill it.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Give us the details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="8"
                  placeholder='So this just happened..'
                  name='comments'
                  value={comments}
                  onChange={this.props.handleInput}
                />
              </Form.Group>
              <Form.Group controlId="formBasicChecbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit" block>
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}