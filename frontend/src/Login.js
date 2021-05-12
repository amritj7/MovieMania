import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import Header from "./Header";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.responseGoogle = this.responseGoogle.bind(this);
    this.state.isLoggedIn = false;
    this.state.profileObj = [];
    this.history = this.props.history;
    this.state.user = "";
  }
  responseGoogle(response) {
    this.setState(
      {
        user: response.profileObj.email.split("@")[0],
        profileObj: response.profileObj,
        isLoggedIn: true,
      },
      () => {
        this.history.push({
          pathname: "./home",
          state: {
            user: this.state.user,
            profileObj: this.state.profileObj,
          },
        });
      }
    );

    console.log(response);
  }
  render() {
    return (
      <div>
        <GoogleLogin
          clientId="427815533001-v7anb53c19e0n5a0ru1af933v24e3mev.apps.googleusercontent.com"
          buttonText="Login"
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
    );
  }
}
export default Login;
