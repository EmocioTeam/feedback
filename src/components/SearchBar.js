import React, { Component, Fragment } from "react";
import { FormGroup } from "react-bootstrap";
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import _ from "lodash";
import { connect } from "react-redux";

class SearchBar extends Component {
  state = {
    multiple: true,
    selected:
      this.props.persistUrlParam && this.props.defaultHashtag
        ? ["#" + this.props.defaultHashtag]
        : []
  };

  render() {
    const { multiple } = this.state;
    const { defaultHashtag } = this.props;
    console.log("#" + defaultHashtag);
    const options = _.orderBy(this.props.hashtags, ["count"], ["desc"]).map(
      hash => `${hash.id}`
    );
    return (
      <div style={{ height: "auto" }}>
        <Typeahead
          // autoFocus
          maxResults={5}
          selected={this.state.selected}
          flip={true}
          name="hashtags"
          id="typeahead"
          allowNew={this.props.allowNew ? this.props.allowNew : false}
          clearButton={true}
          highlightOnlyResult={this.props.allowNew ? false : true}
          labelKey="hashtags"
          multiple={true}
          selectHintOnEnter={true}
          options={options}
          placeholder="#emocio #needcoffee #friday.."
          newSelectionPrefix="Add new hashtag: "
          // defaultInputValue="#"
          onChange={e => {
            const selectedHashtags = e.map(hash => {
              console.log(hash);
              if (typeof hash === "object" && hash.hashtags[0] !== "#") {
                hash.hashtags = "#" + hash.hashtags;
                return hash;
              }
              return hash;
            });
            this.setState({ selected: selectedHashtags });
            e = e.map(hash => {
              if (typeof hash === "string") return hash;
              if (typeof hash === "object") return hash.hashtags;
            });
            this.props.handleHashtags(e);
          }}
          onKeyDown={e => {
            if (e.which === 32 || e.which === 190) {
              e.preventDefault();
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    hashtags: state.hashtags,
    defaultHashtag: state.defaultHashtag
  };
};

export default connect(mapStateToProps)(SearchBar);
