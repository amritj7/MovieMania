import react from "react";
import axios from "axios";
import URL from "./Url";

class Movie extends react.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.history = this.props.history;
    this.state.movieData = this.props.location.state.movieData;
    this.state.movie = this.props.location.state.movie;
    this.state.commentText = "";
    this.state.user = this.props.location.state.user;
    this.handleComment = this.handleComment.bind(this);
    this.renderMovieCard = this.renderMovieCard.bind(this);
    this.returnToHomePage = this.returnToHomePage.bind(this);
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
  returnToHomePage() {
    this.history.goBack();
  }
  renderMovieCard() {
    return (
      <div>
        <button onClick={this.returnToHomePage}>Go back</button>
        <p>Hello</p>
        <p>{this.state.movie.l}</p>
        <img src={this.state.movie.i.imageUrl} />
        <p>Ratings = {this.state.movieData.rating.ratings}</p>
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
