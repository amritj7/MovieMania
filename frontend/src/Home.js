import React from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import URL from "./Url";
import axios from "axios";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.history = this.props.history;
    this.state.searchText = "";
    this.searchMovie = this.searchMovie.bind(this);
    this.renderSearchedMovieList = this.renderSearchedMovieList.bind(this);
    this.state.searchedMovieList = [];
    this.state.
  }

  handleMovie(movie) {
    axios
      .post(URL + "display/" + movie.id)
      .then((response) => {
        
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  searchMovie() {
    axios
      .post(URL + "search/" + this.state.searchText)
      .then((response) => {
        console.log(response.data);
        this.setState({
          searchedMovieList: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  renderSearchedMovieList() {
    return (
      <div>
        {this.state.searchedMovieList.map(
          (movie, index) =>
            movie.i != undefined && (
              <div>
                <p
                  onClick={() => {
                    this.handleMovie(movie);
                  }}
                >
                  {movie.l}
                </p>
                <img src={movie.i.imageUrl} />
              </div>
            )
        )}
      </div>
    );
  }
  renderSearchBar() {
    return (
      <div>
        <form>
          <input
            type="text"
            id="Movie"
            name="Movie"
            value={this.state.searchText}
            onChange={(e) => {
              this.setState({
                searchText: e.target.value,
              });
            }}
          />
        </form>
        <button onClick={this.searchMovie}>Search</button>
      </div>
    );
  }
  render() {
    return (
      <div>
        <p>{localStorage.getItem("data").split("@")[0]}</p>
        <GoogleLogout
          clientId="427815533001-pfdvja4nu5kc7dp33j48b7c2e9vcvvta.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={(response) => {
            //localStorage.clear();
            this.history.goBack();
          }}
          onFailure={(response) => {
            console.log(response);
          }}
        ></GoogleLogout>
        {this.renderSearchBar()}
        {this.renderSearchedMovieList()}
      </div>
    );
  }
}

export default Home;
