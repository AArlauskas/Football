import { CssBaseline } from "@material-ui/core";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginPage from "./containers/LoginPage/LoginPage";

function App() {
  return (
    <Router>
      <CssBaseline>
        <Switch>
          <Route exact path="/">
            <LoginPage />
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
