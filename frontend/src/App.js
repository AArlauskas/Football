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
import TeamPage from "./containers/TeamPage/TeamPage";
import PersonalPage from "./containers/PersonalPage/PersonalPage";
import PlayerPage from "./containers/PlayerPage/PlayerPage";
import ResultsPage from "./containers/ResultsPage/ResultsPage";

const id = window.localStorage.getItem("id");

function App() {
  return (
    <Router>
      <CssBaseline>
        {id === null ? (
          <Switch>
            <Route exact path="/">
              <LoginPage />
            </Route>
            <Route exact path="/register">
              <RegisterPage />
            </Route>
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        ) : (
          <Switch>
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
            <Route exact path="/personal">
              <PersonalPage />
            </Route>
            <Route path="/player/:userId">
              <PlayerPage />
            </Route>
            <Route path="/team/:teamId">
              <TeamPage />
            </Route>
            <Route exact path="/results">
              <ResultsPage />
            </Route>
            <Route>
              <Redirect to="/home" />
            </Route>
          </Switch>
        )}
      </CssBaseline>
    </Router>
  );
}

export default App;
