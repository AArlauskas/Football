import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import { loginPageDrawing } from "../../assets";
import "./styles.css";
import LoginForm from "../../components/LoginForm/LoginForm";

class LoginPage extends React.Component {
  render() {
    return (
      <>
        <Grid
          container
          className="root"
          justify="space-evenly"
          direction="row"
          alignItems="center"
        >
          <Hidden smDown>
            <Grid item>
              <img src={loginPageDrawing} alt="two people watching football" />
            </Grid>
          </Hidden>
          <Grid item xs={10} sm={8} md={4} lg={3}>
            <LoginForm />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default LoginPage;
