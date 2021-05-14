import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import axios from "axios";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import Header from "./Header";
import URL from "./Url";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.responseGoogle = this.responseGoogle.bind(this);
    this.state.profileObj = [];
    this.history = this.props.history;
    this.state.user = "";
    this.state.secretPhrase = "";
  }
  responseGoogle(response) {
    axios
      .post(URL + "auth", {
        token: response,
      })
      .then((res) => {
        this.setState(
          {
            user: response.profileObj.email,
            profileObj: response.profileObj,
            isLoggedIn: true,
            secretPhrase: res.data.secretPhrase,
          },
          () => {
            this.history.push({
              pathname: "./home",
              state: {
                user: this.state.user,
                profileObj: this.state.profileObj,
                secretPhrase: this.state.secretPhrase,
              },
            });
          }
        );
      })
      .catch(function (error) {
        // this.history.push("./");
        console.log(error);
      });

    console.log(response);
  }
  render() {
    return (
      <div
        style={{ backgroundImage: 'url("/bg.jpeg")' }}
        className="w-screen h-screen flex items-center justify-center overflow-auto opacity-50"
      >
        <div className="bg-gray-900 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4  animate-bounce opacity-100">
          <div>
            <h1 class="my-4 text-3xl md:text-5xl text-white opacity-100 font-bold leading-tight text-center md:text-left">
              Welcome to MovieMania
            </h1>
          </div>
          <div className="flex items-center justify-center">
            <div>
              <GoogleLogin
                clientId="427815533001-v7anb53c19e0n5a0ru1af933v24e3mev.apps.googleusercontent.com"
                buttonText="Login"
                render={(renderProps) => (
                  <a
                    onClick={renderProps.onClick}
                    class="inline-block text-blue-300 no-underline cursor-pointer hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out"
                  >
                    Sign in from Google
                  </a>
                )}
                onSuccess={(response) => {
                  console.log(response);
                  this.responseGoogle(response);
                }}
                onFailure={(response) => {
                  console.log(response);
                }}
                cookiePolicy={"single_host_origin"}
                isSignedIn={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
