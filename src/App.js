import React, { Component } from "react";

// REACT ROUTER
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

// CONTAINERS IMPORTS
import FeedPage from "./containers/FeedPage";
import AddFeedback from "./containers/AddFeedback";
import Results from "./containers/Results";
import Navbar from "./containers/Navbar";
import Profile from "./containers/Profile";
import Alert from "./components/Alerts";
import _ from "lodash";

// CSS IMPORTS
import "./styles/App.css";
import "./styles/Card.css";
import "./styles/FeedPage.css";
import "./styles/FeedCard.css";
import "./styles/SearchBar.css";
import "./styles/Results.css";
import "./styles/Navbar.css";
import "./styles/Deck.css";
import "./styles/WelcomePage.css";
import "./styles/SwipeHints.css";
import "./styles/AddCommentModal.css";
import "./styles/EmotionMap.css";
import "./styles/Profile.css";
import "./styles/LazyLoadButton.css";
import "./styles/Loader.css";
import "./styles/RadarChart.css";
import "./styles/ImageUploadPreview.css";
import "./styles/ExpandedComments.css";

// REDUX
import { connect } from "react-redux";

import { fb } from "./config";
import {
  onAuthStateChanged,
  realTimeFeedListener,
  getHashtagList,
  addFeedback as addFeedbackAction,
  deleteFeedback as deleteFeedbackAction,
  addComment as addCommentAction,
  addReaction as addReactionAction
} from "./actions/firebaseActions";
// import { hideKeyboard } from "./actions/hideKeyboard";


class App extends Component {
  state = {
    currentTab: "AddFeedback",
    feeds: [],
    hashtags: [],
    alert: null
  };

  addFeedback = data => {
    this.props
      .addFeedbackAction(data)
      .then(res => {
        this.setState({
          alert: {
            variant: "success",
            msg: "Thank you for your Feedback!!",
            id: res.id,
            hashtags: data.hashtags
          }
        });
        this.props.getHashtagList();
        setTimeout(() => this.setState({ alert: null }), 2000);
      })
      .catch(err => {
        console.log("error", " => ", err);
      });
  };

  deleteFeedback = id => {
    this.props.deleteFeedbackAction(id);
  };

  addComment = (id, comment, author) => {
    this.props.addCommentAction(id, comment, author);
  };

  addReaction = (id, reaction) => {
    this.props.addReactionAction(id, reaction);
  };

  componentDidMount = async () => {
    this.props.onAuthStateChanged();
    this.props.realTimeFeedListener();
    this.props.getHashtagList();
  };

  render() {
    const { feeds, hashtags, alert } = this.state;
    const feedPage = (
      <FeedPage
        refreshing={this.state.refreshing}
        addComment={this.addComment}
        addReaction={this.addReaction}
      />
    );
    const addFeedbackComponent = props => (
      <AddFeedback
        author={this.props.user}
        hashtags={hashtags}
        addFeedback={this.addFeedback}
        deleteFeedback={this.deleteFeedback}
        router={props}
      />
    );
    const addFeedback = pr => {
      return <div>{addFeedbackComponent(pr)}</div>;
    };
    const results = <Results feeds={feeds} hashtags={hashtags} />;
    const profile = <Profile />;

    return (
      <Router>
        {window.location.pathname === "/" ? (
          <Redirect to="/add-feed" />
        ) : (
          false
        )}
        <div className="app-container">
          {alert !== null ? (
            <Alert data={alert} deleteFeedback={this.deleteFeedback} />
          ) : (
            ""
          )}
          <Navbar />
          <Switch>
            <Route
              path="/add-feed/:hashtag"
              render={props => addFeedback(props)}
            />
            <Route path="/add-feed" render={props => addFeedback(props)} />
            <Route path="/feed-page" render={props => feedPage} />
            <Route path="/analytics" render={props => results} />
            <Route path="/profile" render={props => profile} />
            <Route render={props => addFeedback} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth
  };
};

export default connect(
  mapStateToProps,
  {
    onAuthStateChanged,
    realTimeFeedListener,
    getHashtagList,
    addFeedbackAction,
    deleteFeedbackAction,
    addCommentAction,
    addReactionAction
    // hideKeyboard
  }
)(App);
