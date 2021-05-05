import React from "react";
import Login from "./Login";
import Home from "./Home";
import Movie from "./Movie";
import History from "./History";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/movie" component={Movie} />
          <Route exact path="/userHistory" component={History} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;

//Client id : 427815533001-pfdvja4nu5kc7dp33j48b7c2e9vcvvta.apps.googleusercontent.com
//Client key : HgXzHFC-1lZmRpyVGqbYymfS
