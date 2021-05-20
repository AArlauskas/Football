import { CssBaseline } from "@material-ui/core";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ForgotPasswordPage from "./containers/ForgotPasswordPage/ForgotPasswordPage";
import LoginPage from "./containers/LoginPage/LoginPage";
import RegisterPage from "./containers/RegisterPage/RegisterPage";
import ResetPasswordPage from "./containers/ResetPasswordPage/ResetPasswordPage";
import RulesPage from "./containers/RulesPage/RulesPage";

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
          <Route exact path="/forgot-password">
            <ForgotPasswordPage />
          </Route>
          <Route exact path="/reset-password">
            <ResetPasswordPage />
          </Route>
          <Route exact path="/rules">
            <RulesPage />
          </Route>
          <Route>
            <Redirect>
              <LoginPage />
            </Redirect>
          </Route>
        </Switch>
      </CssBaseline>
    </Router>
  );
}

export default App;
