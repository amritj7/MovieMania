import React from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import URL from "./Url";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Header from "./Header";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.state.user = this.props.location.state.user;
    this.state.username = this.props.location.state.username;
    this.history = this.props.history;
    this.state.searchText = "";
    this.searchMovie = this.searchMovie.bind(this);
    this.renderSearchedMovieList = this.renderSearchedMovieList.bind(this);
    this.state.searchedMovieList = [];
  }
  handleMovie(movie) {
    {
      this.history.push({
        pathname: "./movie",
        state: {
          movie: movie,
          user: this.state.user,
          username: this.state.username,
        },
      });
    }
  }
  searchMovie() {
    axios
      .post(URL + "search/" + this.state.searchText)
      .then((response) => {
        console.log(response.data);
        this.setState({
          searchedMovieList: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  renderSearchedMovieList() {
    const url = "https://image.tmdb.org/t/p/w185/";
    return (
      <div>
        {this.state.searchedMovieList.map(
          (movie, index) =>
            movie.poster_path != undefined && (
              <div>
                <p
                  onClick={() => {
                    this.handleMovie(movie);
                  }}
                >
                  {movie.original_title !== undefined
                    ? movie.original_title
                    : movie.name}
                </p>
                <img src={url + movie.poster_path} />
              </div>
            )
        )}
      </div>
    );
  }
  renderSearchBar() {
    return (
      <div>
        <input
          type="text"
          id="Movie"
          name="Movie"
          value={this.state.searchText}
          onChange={(e) => {
            this.setState({
              searchText: e.target.value,
            });
          }}
        />

        <button onClick={this.searchMovie}>Search</button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Header
          user={this.state.user}
          history={this.history}
          username={this.state.username}
        />
        <p>{this.state.user}</p>
        {this.renderSearchBar()}
        {this.renderSearchedMovieList()}
      </div>
    );
  }
}

export default Home;
