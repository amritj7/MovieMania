import axios from "axios";
import React from "react";
import URL from "./Url";
import Header from "./Header";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.state.user = this.props.location.state.user;
    this.state.username = this.props.location.state.username;
    this.state.userData = "";
    this.state.userMovies = [];
    this.renderMovies = this.renderMovies.bind(this);
    this.handleMovie = this.handleMovie.bind(this);
    this.history = this.props.history;
    this.state.isMounted = false;
  }
  componentDidMount() {
    axios
      .post(URL + "history", {
        userID: this.state.user,
      })
      .then((response) => {
        console.log(response.data);
        this.setState(
          {
            userData: response.data.userData,
            userMovies: response.data.userMovies,
            isMounted: true,
          },
          () => {
            console.log(this.state.userMovies);
          }
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleMovie(userMovie) {
    this.history.push({
      pathname: "./movie",
      state: {
        movie: userMovie.movie,
        movieData: userMovie.movieData,
        userData: this.state.userData,
        user: this.state.user,
      },
    });
  }
  renderMovies() {
    const url = "https://image.tmdb.org/t/p/w185/";
    return (
      <div>
        {this.state.userMovies.map((userMovie, index) => (
          <div>
            <p
              onClick={() => {
                this.handleMovie(userMovie);
              }}
            >
              {userMovie.movie.original_title !== undefined
                ? userMovie.movie.original_title
                : userMovie.movie.name}
            </p>
            <img src={url + userMovie.movie.poster_path} />
          </div>
        ))}
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
        {this.renderMovies()}
      </div>
    );
  }
}
export default History;
