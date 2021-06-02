import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import { loginPageDrawing } from "../../assets";
import "./styles.css";
import LoginForm from "../../components/LoginForm/LoginForm";
import { login } from "../../api/Api";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginGeneralError: false,
      showLoginAuthError: false,
    };
  }

  handleLogin = (email, password) => {
    const data = {
      email,
      password,
    };
    login(data)
      .then((response) => {
        console.log(response.data);
        const { history } = this.props;
        history.push("/home");
      })
      .catch((ex) => {
        if (ex.response === undefined) {
          this.setState({ showLoginGeneralError: true });
          return;
        }
        const { status } = ex.response;
        if (status === 400) {
          this.setState({ showLoginAuthError: true });
          return;
        }
        this.setState({ showLoginGeneralError: true });
      });
  };

  hideSnackabar = () => {
    this.setState({ showLoginGeneralError: false, showLoginAuthError: false });
  };

  render() {
    const { showLoginAuthError, showLoginGeneralError } = this.state;
    return (
      <>
        {showLoginGeneralError && (
          <CustomSnackbar
            topCenter
            message="Įvyko klaida, prašome pabandyti vėliau"
            onClose={this.hideSnackabar}
            severity="error"
          />
        )}
        {showLoginAuthError && (
          <CustomSnackbar
            topCenter
            message="Netinkamas prisijungimo vardas arba slaptazodis"
            onClose={this.hideSnackabar}
            severity="error"
          />
        )}
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
          <Grid item xs={11} sm={8} md={4} lg={3}>
            <LoginForm onLogin={this.handleLogin} />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default LoginPage;
