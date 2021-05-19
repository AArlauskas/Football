import { Grid } from "@material-ui/core";
import React from "react";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

class RegisterPage extends React.Component {
  handleRegiser = () => {};

  render() {
    return (
      <>
        <Grid
          container
          className="root"
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={10} sm={9} md={8} lg={5}>
            <RegisterForm onRegister={this.handleRegiser} />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default RegisterPage;
