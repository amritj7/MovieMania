import React from "react";
import axios from "axios";
import URL from "./Url";

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.history = this.props.history;
    this.state.movieData = this.props.location.state.movieData;
    this.state.movie = this.props.location.state.movie;
    this.state.userData = this.props.location.state.userData;
    this.state.commentText = "";
    this.state.isRated = false;
    this.state.currentUserRating = "";
    this.state.user = this.props.location.state.user;
    this.handleComment = this.handleComment.bind(this);
    this.renderMovieCard = this.renderMovieCard.bind(this);
    this.returnToHomePage = this.returnToHomePage.bind(this);
    this.renderRating = this.renderRating.bind(this);
    this.handleRating = this.handleRating.bind(this);
  }
  componentDidMount() {
    console.log(this.state.userData);
    var israted = 0;
    this.state.userData.ratedMovies.map((movieID) => {
      israted = israted + (movieID === this.state.movie.id);
    });
    console.log(israted);
    this.setState({
      isRated: israted !== 0,
    });
  }
  handleComment() {
    var comment = {
      user: this.state.user,
      commentText: this.state.commentText,
    };
    console.log(comment);
    axios
      .post(URL + "comment/" + this.state.movie.id, comment)
      .then((response) => {
        this.setState({
          movieData: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleRating() {
    var currentRating = parseInt(this.state.currentUserRating);
    console.log(currentRating);
    axios
      .post(URL + "rate", {
        movieID: this.state.movie.id,
        rating: currentRating,
        user: this.state.user,
      })
      .then((response) => {
        this.setState({
          movieData: response.data,
          isRated: true,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  returnToHomePage() {
    this.history.push("./home");
  }
  renderRating() {
    return (
      <div>
        <input
          placeholder="rating"
          onChange={(e) => {
            this.setState({
              currentUserRating: e.target.value,
            });
          }}
        ></input>
        <button onClick={this.handleRating}>Rate</button>
      </div>
    );
  }
  renderMovieCard() {
    return (
      <div>
        <button onClick={this.returnToHomePage}>Go back</button>
        <p>Hello</p>
        <p>{this.state.movie.l}</p>
        <img src={this.state.movie.i.imageUrl} />

        {this.state.isRated === false && this.renderRating()}
        <p>Ratings = {this.state.movieData.rating.value}</p>
        <p>
          {this.state.movieData.rating.userCount} number of users has rated.
        </p>
        <input
          placeholder="write"
          onChange={(e) => {
            this.setState({
              commentText: e.target.value,
            });
          }}
        ></input>
        <button onClick={this.handleComment}>Comment</button>
      </div>
    );
  }
  render() {
    return <div>{this.renderMovieCard()}</div>;
  }
}

export default Movie;
