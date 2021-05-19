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
import ResetPasswordPage from "./containers/ResetPasswordPage/ResetPasswordPage";

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
            <ResetPasswordPage />
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
