import axios from "axios";
import React from "react";
import URL from "./Url";
class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.state.user = this.props.location.state.user;
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
    return (
      <div>
        {this.state.userMovies.map((userMovie, index) => (
          <div>
            <p
              onClick={() => {
                this.handleMovie(userMovie);
              }}
            >
              {userMovie.movie.title}
            </p>
            <img src={userMovie.movie.image.url} />
          </div>
        ))}
      </div>
    );
  }
  render() {
    return <div>{this.renderMovies()}</div>;
  }
}
export default History;
