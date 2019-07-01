import React, { Component } from "react";
import {
  Button,
  Badge,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Popover
} from "react-bootstrap";
import moodColorCode from "../moodColorCode";
import data from "../data";

const emojii = data.map(mood => {
  return {
    svg: `./emojii/${mood.name}.svg`,
    name: mood.name
  };
});

export default class NewFeedCard extends Component {
  state = {
    addComment: false,
    showPopover: true
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
    } else if (currentMonth === fullMonth && currentDate > date) {
      dateFormat = currentDate - date + " day(s)";
    } else {
      dateFormat = `${fullMonth} ${date}`;
    }
    return {
      main: `${hours}:${minutes}`,
      secondary: `${dateFormat} ${currentYear === year ? "" : ", " + year}`
    };
  };

  render() {
    const { feed } = this.props;
    // console.log(feed);
    const cardBorderColorCode = {
      borderStyle: "solid",
      borderColor: moodColorCode[feed.mood],
      borderWidth: "0px 0px 0px 5px"
    };

    const cardBadgeColorCode = {
      backgroundColor: moodColorCode[feed.mood]
    };

    return (
      <div className="feed-card" style={cardBorderColorCode}>
        <Badge style={cardBadgeColorCode} className="feed-card-header-meta">
          {feed.mood}
        </Badge>
        <div className="feed-card-content">
          <div className="feed-card-header">
            {feed.title.length > 0 && (
              <p style={{ marginBottom: "0px" }}>{feed.title}</p>
            )}
          </div>
          <div className="feed-card-body">
            <p>{feed.comment}</p>
            {/* <span className="feed-card-header-meta">2:58 PM - 4 Oct 2018</span> */}
            <div className="feed-card-body-meta">
              <strong>
                {this.getDate(feed.timestamp.seconds * 1000).main}
              </strong>{" "}
              {this.getDate(feed.timestamp.seconds * 1000).secondary}
            </div>
            {feed.hashtags.length > 0 && (
              <div className="feed-card-body-hashtags">
                <span>
                  {feed.hashtags.map(hashtag => (
                    <Badge
                      key={hashtag}
                      variant="secondary"
                      style={{ marginRight: 5 }}
                    >
                      {hashtag}
                    </Badge>
                  ))}
                </span>
                <br />
              </div>
            )}
          </div>
          {feed.reactions && (
            <div className="feed-card-reactions">
              {feed.reactions &&
                Object.keys(feed.reactions).map(reaction => {
                  // console.log(feed);
                  return (
                    <div className="feed-card-reactions" key={reaction}>
                      <img
                        key={reaction}
                        src={`./emojii/${reaction}.svg`}
                        className="feed-card-reactions-emojii"
                        onClick={() =>
                          this.props.addReaction(feed.id, reaction)
                        }
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
            <span className="feed-card-actions-item">Share</span>
          </div>
          {feed.comments && feed.comments.length > 0 && (
            <div className="feed-card-comments">
              <hr className="feed-card-comments-divider" />
              {/* <strong>Comments</strong> */}
              {feed.comments.map((comment, i) => {
                return (
                  <div className="feed-card-comments-item-div" key={i}>
                    <p className="feed-card-comments-item">
                      {comment.comment ? comment.comment : comment}
                      <br />
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
                  this.props.addComment(e, feed.id);
                }}
              >
                <Form.Group className="feed-card-add-comment-form-group">
                  {/* <Form.Label>Add a title</Form.Label> */}
                  <InputGroup>
                    <Form.Control
                      autoFocus
                      type="text"
                      placeholder="Interesting cause I think.."
                      value={this.props.commentValue}
                      onChange={e => this.props.handleInput(e, feed.id)}
                      name="feedComment"
                      style={{ borderRadius: "15px", marginRight: "5px" }}
                    />
                    <InputGroup.Append>
                      <Button
                        variant="outline-secondary"
                        style={{ borderRadius: "30px" }}
                        onClick={e => this.props.addComment(e, feed.id)}
                      >
                        Send
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form.Group>
              </Form>
            </div>
          )}
        </div>
      </div>
    );
  }
}