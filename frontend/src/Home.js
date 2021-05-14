import React from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import URL from "./Url";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Header from "./Header";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.state.user = this.props.location.state.user;
    this.state.profileObj = this.props.location.state.profileObj;
    this.state.secretPhrase = this.props.location.state.secretPhrase;
    this.history = this.props.history;
    this.state.isLoading = false;
    this.state.searchText = "";
    this.searchMovie = this.searchMovie.bind(this);
    this.renderSearchedMovieList = this.renderSearchedMovieList.bind(this);
    this.state.searchedMovieList = [];
  }
  handleMovie(movie) {
    {
      this.history.push({
        pathname: "./movie",
        state: {
          movie: movie,
          user: this.state.user,
          profileObj: this.state.profileObj,
          secretPhrase: this.state.secretPhrase,
        },
      });
    }
  }
  searchMovie() {
    this.setState({
      isLoading: true,
    });
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
      })
      .then((response) => {
        this.setState({
          isLoading: false,
        });
      });
  }
  renderSearchedMovieList() {
    const url = "https://image.tmdb.org/t/p/w185/";
    return (
      <div className=" grid grid-cols-5">
        {this.state.searchedMovieList.map(
          (movie, index) =>
            movie.poster_path != undefined && (
              <div
                className="col-span-1 bg-gray-900 opacity-75 w-4/5 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={() => {
                  this.handleMovie(movie);
                }}
              >
                <img className="rounded-lg" src={url + movie.poster_path} />
                <p>
                  {movie.original_title !== undefined
                    ? movie.original_title
                    : movie.name}
                </p>
              </div>
            )
        )}
      </div>
    );
  }
  renderSearchBar() {
    return (
      <form
        class="bg-gray-900 opacity-75 w-4/5 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 "
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            this.searchMovie();
          }
        }}
      >
        <div class="mb-4">
          <label class="block text-blue-300 py-2 font-bold mb-2">
            Search for movies, TV shows
          </label>
          <input
            class="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            type="text"
            placeholder="Search"
            value={this.state.searchText}
            onChange={(e) => {
              this.setState({
                searchText: e.target.value,
              });
            }}
          />
        </div>

        <div class="flex items-center justify-between pt-4">
          {this.state.isLoading === false ? (
            <button
              class="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="button"
              onClick={this.searchMovie}
            >
              Search
            </button>
          ) : (
            <i class="fas fa-circle-notch fa-2x fa-spin"></i>
          )}
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="">
        <Header
          user={this.state.user}
          history={this.history}
          profileObj={this.state.profileObj}
          secretPhrase={this.state.secretPhrase}
        />

        <div class="w-full container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div class="flex flex-col w-full  justify-center lg:items-start overflow-y-hidden">
            <h1 class="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
              Welcome to
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                {" "}
                MovieMania
              </span>
            </h1>
            <p class="leading-normal text-base md:text-2xl mb-8 text-center md:text-left">
              Your one stop for all things cinematic!
            </p>
            {this.renderSearchBar()}
          </div>
          <div className="w-full">{this.renderSearchedMovieList()}</div>
          <div class="w-full pt-16 pb-6 text-sm text-center md:text-left fade-in">
            <a class="text-gray-500 no-underline hover:no-underline" href="#">
              &copy;
            </a>{" "}
            Created by{" "}
            <a class="text-gray-500 no-underline hover:no-underline">
              Amritansh and Aryan
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
