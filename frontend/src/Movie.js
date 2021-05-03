import react from "react";

class Movie extends react.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.renderMovieCard = this.renderMovieCard.bind(this);
  }
  handleMovieCard() {}
  renderMovieCard(movie) {
    return (
      <div>
        <p>{movie.l}</p>
        <img src={movie.imageUrl} />
        <p>Ratings = {movie.rating.ratings}</p>
        <p>{movie.rating.userCount} number of users has rated.</p>
        <input placeholder="write"></input>
        <button>Comment</button>
      </div>
    );
  }
  render() {
    return <div>{this.renderMovieCard()}</div>;
  }
}

export default Movie;
