import React from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = [];
    this.history = this.props.history;
    this.state.user = this.props.user;
    this.state.username = this.props.username;
  }
  render() {
    return (
      <div className="bg-red  flex flex-row p-4">
        <div className="flex-grow">
          <p
            className="text-4xl font-extrabold"
            style={{ "--block-accent-color": "#1DA1F2" }}
            onClick={() => {
              this.history.push({
                pathname: "./home",
                state: {
                  user: this.state.user,
                  username: this.state.username,
                },
              });
            }}
          >
            MovieMania
          </p>
          <p className="font-mono text-sm"></p>
        </div>
        {/* <button
          class="blocks text-right text-md "
          onClick={() => {
            this.history.push({
              pathname: "./userHistory",
              state: {
                user: this.state.user,
                username: this.state.username,
              },
            });
          }}
        >
          My collection
        </button> */}
        <h1>{this.state.username}</h1>
        <GoogleLogout
          clientId="427815533001-v7anb53c19e0n5a0ru1af933v24e3mev.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={(response) => {
            //localStorage.clear();
            this.history.push("./");
          }}
          onFailure={(response) => {
            console.log(response);
          }}
        ></GoogleLogout>
      </div>
    );
  }
}
export default Header;
