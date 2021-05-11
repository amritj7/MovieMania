import React from "react";
import axios from "axios";
import URL from "./Url";
import Header from "./Header";
import ReactStars from "react-rating-stars-component";

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.history = this.props.history;
    this.state.username = this.props.location.state.username;
    this.state.movieData = {
      movieID: "",
      rating: { userCount: 0, value: 0 },
      comments: [],
    };
    this.state.movie = this.props.location.state.movie;
    this.state.userData = { userID: "", movies: [], ratedMovies: [] };
    this.state.commentText = "";
    this.state.isRated = false;
    this.state.currentUserRating = "";
    this.state.user = this.props.location.state.user;
    this.handleComment = this.handleComment.bind(this);
    this.renderMovieCard = this.renderMovieCard.bind(this);
    this.returnToHomePage = this.returnToHomePage.bind(this);
    this.handleRating = this.handleRating.bind(this);
  }
  componentDidMount() {
    axios
      .post(URL + "display", {
        user: this.state.user,
        movie: this.state.movie,
      })
      .then((response) => {
        console.log(response.data);
        var israted = false;
        this.setState(
          {
            userData: response.data.user,
            movieData: response.data.movie,
          },
          () => {
            this.state.userData.ratedMovies.map((movie) => {
              israted = israted || movie.id === this.state.movie.id;
            });
            this.setState({
              isRated: israted,
            });
          }
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleComment() {
    var comment = {
      user: this.state.user,
      commentText: this.state.commentText,
    };
    console.log(comment);
    axios
      .post(URL + "comment", { comment: comment, movie: this.state.movie })
      .then((response) => {
        this.setState({
          movieData: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleRating(newRating) {
    axios
      .post(URL + "rate", {
        movie: this.state.movie,
        rating: newRating,
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
    {
      this.history.push({
        pathname: "./home",
        state: {
          user: this.state.user,
        },
      });
    }
  }

  renderMovieCard() {
    const url = "https://image.tmdb.org/t/p/w185/";
    return (
      <div className="mt-8 grid grid-cols-3 bg-gray-900 opacity-75 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="col-span-1">
          <img
            className="w-4/5 p-5 rounded-sm opacity-75"
            src={url + this.state.movie.poster_path}
          />
        </div>
        <div className="col-span-2 p-5">
          <div className="mb-4">
            <p class="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
              {this.state.movie.original_title !== undefined
                ? this.state.movie.original_title
                : this.state.movie.name}
            </p>
            <p>{this.state.movie.overview}</p>
          </div>
          <div className="mb-8">
            {this.state.isRated === false && (
              <ReactStars
                count={5}
                onChange={(newRating) => {
                  this.handleRating(newRating);
                }}
                size={40}
                activeColor="#ffd700"
              />
            )}
            <p>
              <span>
                <i class="fas fa-star text-3xl text-golden"></i>
              </span>
              <span className="text-3xl">
                {this.state.movieData.rating.value}
              </span>
              <span className="text-xs opacity-50">/5</span>
            </p>
            <p>
              {this.state.movieData.rating.userCount} number of users has rated.
            </p>
          </div>
          <div>
            <input
              placeholder="write"
              onChange={(e) => {
                this.setState({
                  commentText: e.target.value,
                });
              }}
            ></input>
            <button onClick={this.handleComment}>Comment</button>
            <div>
              {this.state.movieData.comments.map((comment, index) => (
                <p>
                  {comment.user} : {comment.commentText}
                </p>
              ))}
            </div>
          </div>
        </div>
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
        {this.renderMovieCard()}
      </div>
    );
  }
}

export default Movie;
