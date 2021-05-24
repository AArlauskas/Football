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

function App() {
  return (
    <Router>
      <CssBaseline>
        <Switch>
          <Route exact path="/">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          {/* <Route exact path="/forgot-password">
            <ForgotPasswordPage />
          </Route> */}
          {/* <Route exact path="/reset-password">
            <ResetPasswordPage />
          </Route> */}
          <Route exact path="/rules">
            <RulesPage />
          </Route>
          {/* <Route exact path="/verify/:id">
            <VerifyAccountPage />
          </Route> */}
          {/* <Route exact path="/confirm-email">
            <ConfirmEmailPage />
          </Route> */}
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/match">
            <MatchPage />
          </Route>
          <Route exact path="/admin">
            <AdminPage />
          </Route>
          <Route exact path="/player">
            <GuessesPage />
          </Route>
          {/* <Route exact path="/profile">
            <ProfilePage />
          </Route> */}
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </CssBaseline>
    </Router>
  );
}

export default App;
