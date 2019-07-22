import React from "react";
import { Button, Modal, Form, Badge } from "react-bootstrap";
// import data from "../data";
import SearchBar from "../components/SearchBar";
import moodColorCode from "../moodColorCode";
import ImageUpload from "./ImageUpload";
import { connect } from "react-redux";
import { uploadImg } from "../actions/firebaseUploadImg";

class Comments extends React.Component {
  state = { pictures: [] };

  onDrop = picture => {
    console.log(picture);
    this.setState({
      pictures: picture
    });
  };

  removePics = () => {
    this.setState({ pictures: [] });
  };

  render() {
    const { email, comment, mood, title } = this.props.state;

    const { data } = this.props;
    // console.log("EEEEOO", this.props.state.currentMood);
    const moodColorCodeBackground =
      data[this.props.state.currentMood] === undefined
        ? ""
        : moodColorCode[data[this.props.state.currentMood].name];

    return (
      <>
        <Modal
          // class="add-comment-modal"
          show={this.props.state.showAddFeedback}
          onHide={this.props.toggleShowAddFeedback}
          dialogClassName="add-comment-modal"
          aria-labelledby="add-comment-modal-custom"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="add-comment-modal-custom-title">
              Add comments!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label style={{ marginBottom: 10 }}>
              Today you are feeling{" "}
              <Badge
                variant="secondary"
                style={{
                  fontSize: "105%",
                  backgroundColor: moodColorCodeBackground
                }}
              >
                {data[this.props.state.currentMood] === undefined
                  ? ""
                  : data[this.props.state.currentMood].name}
              </Badge>{" "}
              !
            </Form.Label>
            <Form
              onSubmit={e => {
                this.props.handleSubmit(
                  e,
                  this.state.pictures[this.state.pictures.length - 1]
                );
                this.removePics();
              }}
            >
              <Form.Group>
                <Form.Label>Add Hashtags</Form.Label>
                <SearchBar
                  allowNew={true}
                  handleHashtags={this.props.handleHashtags}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Give us the details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="8"
                  placeholder="So this just happened..And I said.. THAT. IS. AWESOME!!!"
                  name="comment"
                  value={comment}
                  onChange={this.props.handleInput}
                />
              </Form.Group>
              <Button
                variant="secondary"
                as={ImageUpload}
                block
                onDrop={this.onDrop}
                removePics={this.removePics}
                pictures={this.state.pictures}
              />
              <Button
                block
                variant="primary"
                type="submit"
                style={{ paddingLeft: "50px", paddingRight: "50px" }}
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default connect(
  null,
  { uploadImg }
)(Comments);
