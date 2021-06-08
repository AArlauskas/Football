import { CssBaseline } from "@material-ui/core";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginPage from "./containers/LoginPage/LoginPage";
import RegisterPage from "./containers/RegisterPage/RegisterPage";
import RulesPage from "./containers/RulesPage/RulesPage";
import HomePage from "./containers/HomePage/HomePage";
import MatchPage from "./containers/MatchPage/MatchPage";
import AdminPage from "./containers/AdminPage/AdminPage";
import GuessesPage from "./containers/GuessesPage/GuessesPage";
import TeamPage from "./containers/TeamPage/TeamPage";

function App() {
  const id = window.localStorage.getItem("id");
  return (
    <Router>
      <CssBaseline>
        <Switch>
          {id === null ? (
            <>
              <Route exact path="/">
                <LoginPage />
              </Route>
              <Route exact path="/register">
                <RegisterPage />
              </Route>
              <Route>
                <Redirect to="/" />
              </Route>
            </>
          ) : (
            <>
              <Route exact path="/rules">
                <RulesPage />
              </Route>
              <Route exact path="/home">
                <HomePage />
              </Route>
              <Route path="/match/:gameId">
                <MatchPage />
              </Route>
              <Route exact path="/admin">
                <AdminPage />
              </Route>
              <Route exact path="/player">
                <GuessesPage />
              </Route>
              <Route path="/team/:teamId">
                <TeamPage />
              </Route>
              <Route>
                <Redirect to="/home" />
              </Route>
            </>
          )}
        </Switch>
      </CssBaseline>
    </Router>
  );
}

export default App;
