import react from "react";

class Movie extends react.Component {
  constructor(props) {
    super(props);
    this.state = [];
  }
  render() {
    return <div>{this.renderMovieCard}</div>;
  }
}

export default Movie;
