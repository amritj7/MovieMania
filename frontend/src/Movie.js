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
    this.state.profileObj = this.props.location.state.profileObj;
    this.state.movieData = {
      movieID: "",
      rating: { userCount: 0, value: 0 },
      comments: [],
    };
    this.state.movie = this.props.location.state.movie;
    this.state.userData = { userID: "", movies: [], ratedMovies: [] };
    this.state.commentText = "";
    this.state.isRated = false;
    this.state.rateLoading = false;
    this.state.isLoading = true;
    this.state.currentUserRating = "";
    this.state.commentLoading = false;
    this.state.user = this.props.location.state.user;
    this.handleComment = this.handleComment.bind(this);
    this.renderMovieCard = this.renderMovieCard.bind(this);
    this.returnToHomePage = this.returnToHomePage.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.renderComments = this.renderComments.bind(this);
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
              isLoading: false,
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
    this.setState({
      commentLoading: true,
    });
    console.log(comment);
    axios
      .post(URL + "comment", { comment: comment, movie: this.state.movie })
      .then((response) => {
        this.setState({
          movieData: response.data,
          commentText: "",
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then((response) => {
        this.setState({
          commentLoading: false,
        });
      });
  }
  handleRating(newRating) {
    this.setState({
      rateLoading: true,
    });
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
      })
      .then((response) => {
        this.setState({
          rateLoading: false,
        });
      });
  }
  returnToHomePage() {
    {
      this.history.push({
        pathname: "./home",
        state: {
          user: this.state.user,
          profileObj: this.state.profileObj,
        },
      });
    }
  }

  renderComments() {
    return (
      <div className="p-4 border rounded-md bg-black">
        <div>
          {this.state.movieData.comments.map((comment, index) => (
            <div className="px-4 p-2 m-4 my-4 w-auto bg-gray-700 rounded-lg">
              <span>
                <p className=" text-md md:text-md  text-white opacity-50 font-bold leading-tight text-center md:text-left">
                  <i class="fa fa-comments" aria-hidden="true"></i>{" "}
                  {comment.user}
                </p>

                <p className="w-auto">
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {comment.commentText}
                </p>
              </span>
            </div>
          ))}
        </div>
        <div className="p-4">
          <textarea
            className="w-full p-2 rounded-md"
            placeholder="Write here.."
            value={this.state.commentText}
            onChange={(e) => {
              this.setState({
                commentText: e.target.value,
              });
            }}
            rows="2"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                this.handleComment();
              }
            }}
          ></textarea>
          <div className="py-2">
            {this.state.commentLoading === false ? (
              <button
                class="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={this.handleComment}
              >
                Comment
              </button>
            ) : (
              <i class="fas fa-circle-notch fa-2x fa-spin"></i>
            )}
          </div>
        </div>
      </div>
    );
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
            <p className="pt-2">
              Released on:{" "}
              <span className="text-white">
                {this.state.movie.first_air_date}
              </span>
            </p>
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
            {this.state.rateLoading === false ? (
              <div>
                <p>
                  <span>
                    <i class="fas fa-star text-3xl text-golden"></i>{" "}
                  </span>
                  <span className="text-3xl">
                    {this.state.movieData.rating.value}
                  </span>
                  <span className="text-xs opacity-50">/5</span>
                </p>
                <p>
                  {this.state.movieData.rating.userCount}{" "}
                  {this.state.movieData.rating.userCount === 1
                    ? "user has"
                    : "users have"}{" "}
                  rated.
                </p>{" "}
              </div>
            ) : (
              <i class="fas fa-circle-notch fa-spin"></i>
            )}
          </div>
          {this.renderComments()}
        </div>
      </div>
    );
  }
  render() {
    return (
      this.state.isLoading === false && (
        <div>
          <Header
            user={this.state.user}
            history={this.history}
            profileObj={this.state.profileObj}
          />
          {this.renderMovieCard()}
        </div>
      )
    );
  }
}

export default Movie;
