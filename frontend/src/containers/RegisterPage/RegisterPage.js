import { Grid } from "@material-ui/core";
import React from "react";
import { withRouter } from "react-router";
import { register } from "../../api/Api";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import "./styles.css";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRegisterSuccess: false,
      showRegisterError: false,
    };
  }

  handleRegiser = (firstname, lastname, email, password) => {
    const data = {
      firstname,
      lastname,
      email,
      password,
    };
    register(data)
      .then((response) => {
        this.setState({ showRegisterSuccess: true });
        console.log(response.data);
        const { history } = this.props;
        history.push("/");
      })
      .catch(() => this.setState({ showRegisterError: true }));
  };

  hideSnackabar = () => {
    this.setState({ showRegisterError: false, showRegisterSuccess: false });
  };

  render() {
    const { showRegisterError, showRegisterSuccess } = this.state;
    return (
      <>
        {showRegisterError && (
          <CustomSnackbar
            topCenter
            message="Įvyko klaida, prašome pabandyti vėliau"
            onClose={this.hideSnackabar}
            severity="error"
          />
        )}
        {showRegisterSuccess && (
          <CustomSnackbar
            topCenter
            message="Registracija atlikta sėkmingai"
            onClose={this.hideSnackabar}
            severity="success"
          />
        )}
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

export default withRouter(RegisterPage);
