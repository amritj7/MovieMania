import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.responseGoogle = this.responseGoogle.bind(this);
  }
  responseGoogle(response) {
    console.log(response);
  }
  render() {
    return (
      <div>
        <GoogleLogin
          clientId="427815533001-pfdvja4nu5kc7dp33j48b7c2e9vcvvta.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={(response) => {
            this.responseGoogle(response);
          }}
          onFailure={(response) => {
            this.responseGoogle(response);
          }}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
        {/* <GoogleLogout
          clientId="427815533001-pfdvja4nu5kc7dp33j48b7c2e9vcvvta.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={ }
        ></GoogleLogout> */}
      </div>
    );
  }
}
export default Login;
