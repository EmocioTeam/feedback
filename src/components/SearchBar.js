import React, { Component, Fragment } from "react";
import { FormGroup } from "react-bootstrap";
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import _ from "lodash";

export default class SearchBar extends Component {
  state = {
    multiple: true
  };

  render() {
    const { multiple } = this.state;
    // console.log();
    const options = _.orderBy(this.props.hashtags, ["count"], ["desc"]).map(
      hash => `${hash.id}`
    );
    return (
      <div style={{ height: "auto" }}>
        <Typeahead
          style={{ height: "auto" }}
          name="hashtags"
          id="typeahead"
          allowNew={this.props.allowNew ? this.props.allowNew : false}
          clearButton={true}
          highlightOnlyResult={this.props.allowNew ? false : true}
          labelKey="hashtags"
          multiple={true}
          selectHintOnEnter={true}
          options={options}
          placeholder="#skypemeeting #needcoffee #happyfriday.."
          newSelectionPrefix="Add new hashtag: "
          // defaultInputValue="#"
          // gives you the array of selected hashtags
          // onInputChange={e => {
          // console.log(e);
          // this.props.handleHashtags(e)
          // }}
          // gives you the input string that it is being typed
          onChange={e => {
            // console.log(e);
            e = e.map(hash => {
              if (typeof hash === "string") return hash;
              if (typeof hash === "object") return hash.hashtags;
            });
            // console.log("eeoo", e);
            this.props.handleHashtags(e);
          }}
          onKeyDown={e => {
            // console.log("onKeyDown", " => ", e.which, this);
            // console.log("string?", " => ", e.target.value);
            // var regex = new RegExp("^[a-zA-Z0-9]+$");
            // var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            // if ((!regex.test(key) && e.which !== 8) || e.which > 180) {
            //   e.preventDefault();
            //   return false;
            // }
            if (e.which === 32 || e.which === 190) {
              e.preventDefault();
            }
          }}
        />
      </div>
    );
  }
}
