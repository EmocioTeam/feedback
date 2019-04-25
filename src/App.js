import React, { Component } from 'react';
import Comments from './components/Comments';
import Radar from './components/Radar';
import Deck from './components/Deck';
import ReactDOM from 'react-dom';
import './styles/App.css';

export default class App extends Component {

    state = {
        isSubmitted: false,
        email: '',
        comments: '',
        mood: ''
    }

    handleInput = (e, input) => {
        this.setState({ [e.target.name]: e.target.value })
        console.log(this.state)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ isSubmitted: true })
    }

    goToDeck = () => {
        this.setState({
            isSubmitted: false
        })
    }

    render() {
        if (!this.state.isSubmitted) {
            ReactDOM.render(<Deck />, document.getElementById("root"));
            return <div>
                <Comments
                    handleInput={this.handleInput}
                    handleSubmit={this.handleSubmit}
                    state={this.state}
                />
            </div>
        } else {
            ReactDOM.render('', document.getElementById("root"));
            return (
                <Radar goToDeck={this.goToDeck} />
            )
        }
    }
}
