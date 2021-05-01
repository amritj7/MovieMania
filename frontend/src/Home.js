import React from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.history = this.props.history;
  }
  render() {
    return (
      <div>
        <p>{localStorage.getItem("data").split("@")[0]}</p>
        <GoogleLogout
          clientId="427815533001-pfdvja4nu5kc7dp33j48b7c2e9vcvvta.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={(response) => {
            this.history.goBack();
          }}
          onFailure={(response) => {
            console.log(response);
          }}
        ></GoogleLogout>
      </div>
    );
  }
}

export default Home;
