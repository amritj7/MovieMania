import axios from "axios";
import React from "react";
import URL from "./Url";
import Header from "./Header";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.state.user = this.props.location.state.user;
    this.state.profileObj = this.props.location.state.profileObj;
    this.state.secretPhrase = this.props.location.state.secretPhrase;
    this.state.userData = "";
    this.state.isLoading = false;
    this.state.userMovies = [];
    this.renderMovies = this.renderMovies.bind(this);
    this.handleMovie = this.handleMovie.bind(this);
    this.history = this.props.history;
    this.state.isMounted = false;
  }
  componentDidMount() {
    axios
      .post(URL + "history", {
        user: this.state.user,
        secretPhrase: this.state.secretPhrase,
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
        secretPhrase: this.state.secretPhrase,
      },
    });
  }
  renderMovies() {
    const url = "https://image.tmdb.org/t/p/w185/";
    return (
      <div className=" grid grid-cols-5">
        {this.state.userMovies.map(
          (foundMovie, index) =>
            foundMovie.movie.poster_path != undefined && (
              <div
                className="col-span-1 bg-gray-900 opacity-75 w-4/5 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={() => {
                  this.handleMovie(foundMovie);
                }}
              >
                <img
                  className="rounded-lg"
                  src={url + foundMovie.movie.poster_path}
                />
                <p>
                  {foundMovie.movie.original_title !== undefined
                    ? foundMovie.movie.original_title
                    : foundMovie.movie.name}
                </p>
              </div>
            )
        )}
      </div>
    );
  }
  render() {
    return (
      <div>
        <Header
          user={this.state.user}
          history={this.history}
          profileObj={this.state.profileObj}
          secretPhrase={this.state.secretPhrase}
        />
        {this.renderMovies()}
      </div>
    );
  }
}
export default History;
