import React, { Component } from "react";
import {
  Button,
  Badge,
  Form,
  InputGroup,
  OverlayTrigger,
  Popover
} from "react-bootstrap";
import moodColorCode from "../moodColorCode";
import data from "../data";
import Emoji from "react-facebook-emoji";
import { fetchImg } from "../actions/firebaseUploadImg";
import { connect } from "react-redux";
import { hideKeyboard } from "../actions/hideKeyboard";

const emojii = data.map(mood => {
  return {
    svg: `${__dirname}emojii/${mood.name}.svg`,
    name: mood.name
  };
});

class NewFeedCard extends Component {
  state = {
    addComment: false,
    showPopover: true,
    feedComment: "",
    maxCommentChars: 140,
    characterCount: 0,
    alertCommentChars: false
  };

  getDate = timestamp => {
    const d = new Date(timestamp);
    // console.log(d)
    const hours = d.getHours();
    const minutes =
      d.getMinutes().toString().length === 1
        ? `0${d.getMinutes()}`
        : d.getMinutes();
    // console.log("mins", minutes.toString().length);
    const date = d.getDate();
    const month = d.getMonth();
    const monthArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
    const fullMonth = monthArr[month];
    const year = d.getFullYear();
    const currentYear = new Date().getFullYear();
    const currentMonth = monthArr[new Date().getMonth()];
    const currentDate = new Date().getDate();
    let dateFormat = "";
    if (currentMonth === fullMonth && currentDate === date) {
      dateFormat = "Today";
    } else if (
      currentMonth === fullMonth &&
      currentDate > date &&
      currentDate - date <= 7
    ) {
      dateFormat = currentDate - date + " day(s)";
    } else {
      dateFormat = `${fullMonth} ${date}`;
    }
    return {
      main: dateFormat === "Today" ? `${hours}:${minutes}` : "",
      secondary: `${dateFormat} ${currentYear === year ? "" : ", " + year}`
    };
  };

  getCharacterCount = () => {
    this.setState({ characterCount: this.state.feedComment.length });
  };

  handleInput = (e, id) => {
    if (this.state.feedComment.length >= 140) {
      this.setState({ alertCommentChars: true });
    } else {
      this.setState({ alertCommentChars: false });
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  addComment = (e, id) => {
    e.preventDefault();
    // console.log("feedId", id);

    const author = {};
    // first get if user is logged in
    if (this.props.user.email) {
      this.props.user.user
        ? (author.name = this.props.user.user)
        : (author.name = "SpookyMinion");
    }
    this.props.user.stakeholder
      ? (author.stakeholder = true)
      : (author.stakeholder = false);

    if (
      this.state.feedComment.length < 141 &&
      this.state.feedComment.length > 0
    ) {
      this.props.addComment(id, this.state.feedComment, author);
      this.setState({ feedComment: "", characterCount: 0 });
    }
  };

  render() {
    const { feed } = this.props;
    const cardBorderColorCode = {
      borderStyle: "solid",
      borderColor: moodColorCode[feed.mood],
      borderWidth: "5px 0px 0px 0px"
    };

    const cardBadgeColorCode = {
      backgroundColor: moodColorCode[feed.mood]
    };

    return (
      <div className="feed-card" style={cardBorderColorCode} id={feed.id}>
        {this.props.showActions && (
          <span style={{ float: "left" }} className="text-muted">
            X
          </span>
        )}
        <Badge style={cardBadgeColorCode} className="feed-card-header-meta">
          {feed.mood}
        </Badge>
        {feed.picture && <img className="feed-card-image" src={feed.picture} />}
        <div className="feed-card-content">
          <div className="feed-card-body">
            {feed.hashtags.length > 0 && (
              <div className="feed-card-body-hashtags" key={feed.id}>
                {feed.hashtags.map((hashtag, index) => (
                  <Badge
                    key={index + "-" + hashtag + "-" + feed.id}
                    variant="secondary"
                    style={
                      hashtag === "#Lisbon"
                        ? { backgroundColor: "#8CC785", marginRight: 5 }
                        : { marginRight: 5 }
                    }
                  >
                    {hashtag}
                  </Badge>
                ))}
                <br />
              </div>
            )}
            <p>
              {feed.author && <strong>{feed.author} </strong>}
              {feed.comment.split("\n").map((row, index) => (
                <span key={index}>
                  {row}
                  <br />
                </span>
              ))}
            </p>
            <div className="feed-card-body-meta">
              <strong>
                {this.getDate(feed.timestamp.seconds * 1000).main}
              </strong>{" "}
              {this.getDate(feed.timestamp.seconds * 1000).secondary}
            </div>
          </div>
          {this.props.showActions === false
            ? false
            : true && (
                <div>
                  {feed.reactions && (
                    <div className="feed-card-reactions">
                      {feed.reactions &&
                        Object.keys(feed.reactions).map(reaction => {
                          return (
                            <div className="feed-card-reactions" key={reaction}>
                              {/* <Emoji type={reaction} size="sm" /> */}
                              <img
                                key={reaction}
                                src={`${__dirname}emojii/${reaction}.svg`}
                                className="feed-card-reactions-emojii"
                              />
                              <div className="feed-card-reaction-counter">
                                {feed.reactions[reaction]}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  <div className="feed-card-actions">
                    {
                      <OverlayTrigger
                        // ref="overlay"
                        placement="top"
                        trigger="click"
                        rootClose
                        onClick={() => this.setState({ showPopover: true })}
                        show={this.state.showPopover}
                        overlay={
                          <Popover id={`tooltip-top`}>
                            {emojii.map(mood => {
                              return (
                                <img
                                  key={mood.name}
                                  src={mood.svg}
                                  className="feed-card-actions-emojii"
                                  onClick={() => {
                                    this.props.addReaction(feed.id, mood.name);
                                    document.body.click();
                                    // this.refs.overlay.hide();
                                  }}
                                />
                              );
                            })}
                          </Popover>
                        }
                      >
                        <span className="feed-card-actions-item">Like</span>
                      </OverlayTrigger>
                    }
                    <span
                      className="feed-card-actions-item"
                      onClick={() => {
                        // console.log(feed.id);
                        this.setState({
                          addCommentFocus: true,
                          addComment: true // this.state.addComment ? false : true
                        });
                      }}
                    >
                      Comment
                    </span>
                    {/* <span className="feed-card-actions-item">Dislike</span> */}
                    {/* <span className="feed-card-actions-item">Share</span> */}
                  </div>

                  {feed.comments && feed.comments.length > 0 && (
                    <div className="feed-card-comments">
                      <hr className="feed-card-comments-divider" />
                      {/* <strong>Comments</strong> */}
                      {feed.comments.map((comment, i) => {
                        return (
                          <div className="feed-card-comments-item-div" key={i}>
                            <p
                              className="feed-card-comments-item"
                              style={
                                comment.author && comment.author.stakeholder
                                  ? // && comment.author.stakeholder
                                    { backgroundColor: "#c1e7ff" }
                                  : {}
                              }
                            >
                              {comment.comment ? (
                                <span>
                                  {comment.author && comment.author.name ? (
                                    <strong style={{ fontSize: "90%" }}>
                                      {comment.author.name} <br />
                                    </strong>
                                  ) : (
                                    ""
                                  )}

                                  {comment.comment
                                    .split("\n")
                                    .map((row, index) => (
                                      <span key={index}>
                                        {row}
                                        <br />
                                      </span>
                                    ))}
                                </span>
                              ) : (
                                comment
                              )}
                              <span className="feed-card-comments-item-actions">
                                {comment.timestamp ? (
                                  <span>
                                    <strong>
                                      {this.getDate(comment.timestamp).main}
                                    </strong>{" "}
                                    {this.getDate(comment.timestamp).secondary}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {this.state.addComment && (
                    <div className="feed-card-add-comment">
                      <Form
                        onSubmit={e => {
                          this.addComment(e, feed.id);
                        }}
                      >
                        <Form.Group className="feed-card-add-comment-form-group">
                          {/* <Form.Label>Add a title</Form.Label> */}
                          <InputGroup>
                            <Form.Control
                              autoFocus
                              // onFocus={() => {
                              //   if (
                              //     window.outerHeight !==
                              //     window.screen.availHeight
                              //   ) {
                              //     this.props.hideKeyboard(true);
                              //   } else {
                              //     this.props.hideKeyboard(false);
                              //   }
                              // }}
                              // onBlur={() => {
                              //   this.props.hideKeyboard(false);
                              // }}
                              as="textarea"
                              rows={1}
                              autoComplete="off"
                              type="text"
                              placeholder="Interesting cause I think.."
                              value={this.state.feedComment}
                              onKeyDown={e => {
                                if (
                                  this.state.feedComment.split("\n").length >=
                                    6 &&
                                  e.which === 13
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              onKeyUp={element => {
                                element.target.style.height = "5px";
                                element.target.style.height =
                                  element.target.scrollHeight + "px";
                              }}
                              onChange={e => {
                                this.getCharacterCount();
                                this.handleInput(e, feed.id);
                              }}
                              name="feedComment"
                              style={{
                                borderRadius: "15px",
                                marginRight: "5px",
                                height: "auto"
                              }}
                            />
                            <InputGroup.Append>
                              <Button
                                variant="secondary"
                                style={{ borderRadius: "15px" }}
                                onClick={e => this.addComment(e, feed.id)}
                              >
                                Send
                              </Button>
                            </InputGroup.Append>
                          </InputGroup>
                          <Form.Text
                            className={
                              !this.state.alertCommentChars ? "text-muted" : ""
                            }
                            style={{
                              marginLeft: "10px",
                              color: this.state.alertCommentChars
                                ? "#f44336"
                                : ""
                            }}
                          >
                            {this.state.characterCount || 0}/
                            {this.state.maxCommentChars || 140}
                            {this.state.alertCommentChars
                              ? " Max 140 characters per comment!!"
                              : ""}
                          </Form.Text>
                        </Form.Group>
                      </Form>
                    </div>
                  )}
                </div>
              )}
          {this.props.showActions === false ? (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="secondary"
                onClick={() => {
                  this.props.closeCard();
                }}
                // className="text-muted"
              >
                Close
              </Button>
            </div>
          ) : (
            false
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state.feedCardImg);
  return {
    img: state.feedCardImg
  };
};

export default connect(
  mapStateToProps,
  { fetchImg, hideKeyboard }
)(NewFeedCard);
