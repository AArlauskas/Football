import React from "react";
import { Button, Grid, Hidden } from "@material-ui/core";
import { loginPageDrawing } from "../../assets";
import "./styles.css";
import LoginForm from "../../components/LoginForm/LoginForm";
import { login } from "../../api/Api";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import LOCALES from "../../translations/locales";
import LanguageFlagLT from "../../assets/Generic/LanguageFlagLT";
import LanguageFlagEN from "../../assets/Generic/LanguageFlagEN";
import LocalizationContext from "../../components/TranslationsProvider/TranslationContext";

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
        const isAdmin = response.data.roles.includes("admin");
        localStorage.setItem("isAdmin", isAdmin);
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("lastName", response.data.lastName);
        window.location.reload();
      })
      .catch((ex) => {
        if (ex.response === undefined) {
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
    const [language, setLanguage] = this.context;

    return (
      <div className="root">
        {showLoginGeneralError && (
          <CustomSnackbar
            topCenter
            messageIntl="GENERAL_ERROR"
            onClose={this.hideSnackabar}
            severity="error"
          />
        )}
        {showLoginAuthError && (
          <CustomSnackbar
            topCenter
            messageIntl="INVALID_CREDENTIALS"
            onClose={this.hideSnackabar}
            severity="error"
          />
        )}
        <div className="languageTopBar">
          {language === LOCALES.LITHUANIAN ? (
            <Button
              style={{ borderRadius: "50%" }}
              onClick={() => setLanguage(LOCALES.ENGLISH)}
            >
              <LanguageFlagLT />
            </Button>
          ) : (
            <Button
              style={{ borderRadius: "50%" }}
              onClick={() => setLanguage(LOCALES.LITHUANIAN)}
            >
              <LanguageFlagEN />
            </Button>
          )}
        </div>
        <Grid
          container
          justify="space-evenly"
          direction="row"
          alignItems="center"
          style={{ height: "calc(100% - 47px)" }}
        >
          <Hidden smDown>
            <Grid item>
              <img src={loginPageDrawing} alt="two people watching football" />
            </Grid>
          </Hidden>
          <Grid item xs={11} sm={9} md={5} lg={4}>
            <LoginForm onLogin={this.handleLogin} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

LoginPage.contextType = LocalizationContext;

export default LoginPage;
