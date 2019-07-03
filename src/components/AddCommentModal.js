import React from "react";
import { Button, Modal, Form, Badge } from "react-bootstrap";
// import data from "../data";
import SearchBar from "../components/SearchBar";

const InputGroup = ({
  name,
  label,
  type,
  value,
  placeholder,
  description,
  handleInput
}) => {
  return (
    <Form.Group controlId="formBasicEmail">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        name={name}
      />
      <Form.Text className="text-muted">{description}</Form.Text>
    </Form.Group>
  );
};

export default class Comments extends React.Component {
  state = {};

  render() {
    const { email, comment, mood, title } = this.props.state;
    const { data } = this.props;
    const emailInput = {
      name: "email",
      label: "Email Address",
      type: "email",
      value: email,
      placeholder: "Enter email",
      description:
        "This field is totally optional. If you want to keep your anonymity please do not fill it.",
      handleInput: this.props.handleInput
    };
    const hashtagsInput = {
      name: "hastags",
      label: "Add Hashtags",
      type: "text",
      value: this.props.state.hashtags,
      placeholder: "meeting.. mondays..",
      description:
        "Add some context to your feedback! Just got out of a skype meeting? Awesome colleague brought breakfast?",
      handleInput: this.props.handleInput
    };
    return (
      <>
        <Modal
          // class="add-comment-modal"
          show={this.props.state.showAddFeedback}
          onHide={this.props.toggleShowAddFeedback}
          dialogClassName="add-comment-modal"
          aria-labelledby="example-custom-modal-styling-title"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Add comments!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label style={{ marginBottom: 10 }}>
              Today you are feeling{" "}
              <Badge variant="secondary" style={{ fontSize: "105%" }}>
                {data[this.props.state.currentMood] === undefined
                  ? ""
                  : data[this.props.state.currentMood].name}
              </Badge>{" "}
              !
            </Form.Label>
            <Form
              onSubmit={e => {
                this.props.handleSubmit(e);
              }}
            >
              {/* {InputGroup(emailInput)} */}
              {/* {InputGroup(hashtagsInput)} */}
              {/* <Form.Group>
                <Form.Label>Add a title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="My awesome day!!"
                  value={title}
                  onChange={this.props.handleInput}
                  name="title"
                />
              </Form.Group> */}
              <Form.Group>
                <Form.Label>Add Hashtags</Form.Label>
                <SearchBar
                  allowNew={true}
                  hashtags={this.props.hashtags}
                  handleHashtags={this.props.handleHashtags}
                />
                {/* <Form.Text>
                  Add some context to your feedback! Just got out of a skype
                  meeting? Awesome colleague brought breakfast? Tag it!
                </Form.Text> */}
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Give us the details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="6"
                  placeholder="So this just happened..And I said.. THAT. IS. AWESOME!!!"
                  name="comment"
                  value={comment}
                  onChange={this.props.handleInput}
                />
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
