import axios from "axios";
import React from "react";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.state.user = this.props.location.state.user;
    this.state.userData = "";
    this.state.userMovies = "";
    this.renderMovies = this.renderMovies.bind(this);
    this.handleMovie = this.handleMovie.bind(this);
  }
  componentDidMount() {
    axios
      .post(URL + "history", {
        userID: this.state.user,
      })
      .then((response) => {
        this.setState({
          userData: response.data.userData,
          userMovies: response.data.userMovies,
        });
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
              {userMovie.movie.l}
            </p>
            <img src={userMovie.movie.i.imageUrl} />
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
