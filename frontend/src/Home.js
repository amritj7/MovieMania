import React from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import URL from "./Url";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.state.user = this.props.location.state.user;
    this.history = this.props.history;
    this.state.searchText = "";
    this.searchMovie = this.searchMovie.bind(this);
    this.renderSearchedMovieList = this.renderSearchedMovieList.bind(this);
    this.redirectToHistory = this.redirectToHistory.bind(this);
    this.state.searchedMovieList = [];
  }

  handleMovie(movie) {
    {
      this.history.push({
        pathname: "./movie",
        state: {
          movie: movie,
          user: this.state.user,
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
    return (
      <div>
        {this.state.searchedMovieList.map(
          (movie, index) =>
            movie.image != undefined && (
              <div>
                <p
                  onClick={() => {
                    this.handleMovie(movie);
                  }}
                >
                  {movie.title}
                </p>
                <img src={movie.image.url} />
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
  redirectToHistory() {
    this.history.push({
      pathname: "./userHistory",
      state: {
        user: this.state.user,
      },
    });
  }
  render() {
    return (
      <div>
        <p>{this.state.user}</p>
        <GoogleLogout
          clientId="427815533001-pfdvja4nu5kc7dp33j48b7c2e9vcvvta.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={(response) => {
            //localStorage.clear();
            this.history.push("./");
          }}
          onFailure={(response) => {
            console.log(response);
          }}
        ></GoogleLogout>
        {this.renderSearchBar()}
        {this.renderSearchedMovieList()}
        <button onClick={this.redirectToHistory}>History</button>
      </div>
    );
  }
}

export default Home;
