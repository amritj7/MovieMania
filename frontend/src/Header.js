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
      <div class="w-full container mx-auto">
        <div class="w-full flex items-center justify-between">
          <a
            onClick={() => {
              this.history.push({
                pathname: "./home",
                state: {
                  user: this.state.user,
                  username: this.state.username,
                },
              });
            }}
            class="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
          >
            Movie
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
              Mania
            </span>
          </a>

          <div class="flex w-1/2 justify-end content-center">
            <a
              class="inline-block cursor-pointer text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out"
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
            </a>
            <a class="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out">
              {this.state.username}
            </a>
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
        </div>
      </div>
    );
  }
}
export default Header;
