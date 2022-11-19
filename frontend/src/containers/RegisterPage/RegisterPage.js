import { Button, Grid } from "@material-ui/core";
import React from "react";
import { withRouter } from "react-router";
import { register } from "../../api/Api";
import LanguageFlagEN from "../../assets/Generic/LanguageFlagEN";
import LanguageFlagLT from "../../assets/Generic/LanguageFlagLT";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import LocalizationContext from "../../components/TranslationsProvider/TranslationContext";
import LOCALES from "../../translations/locales";
import "./styles.css";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRegisterSuccess: false,
      showRegisterError: false,
    };
  }

  handleRegiser = (firstName, lastName, email, password) => {
    const data = {
      firstName,
      lastName,
      email,
      password,
    };
    register(data)
      .then(() => {
        this.setState({ showRegisterSuccess: true });
        setTimeout(() => {
          const { history } = this.props;
          history.push("/");
        }, 3000);
      })
      .catch(() => this.setState({ showRegisterError: true }));
  };

  hideSnackabar = () => {
    this.setState({ showRegisterError: false, showRegisterSuccess: false });
  };

  render() {
    const { showRegisterError, showRegisterSuccess } = this.state;
    const [language, setLanguage] = this.context;
    return (
      <>
        {showRegisterError && (
          <CustomSnackbar
            topCenter
            messageIntl="GENERAL_ERROR"
            onClose={this.hideSnackabar}
            severity="error"
          />
        )}
        {showRegisterSuccess && (
          <CustomSnackbar
            topCenter
            messageIntl="SUCESSFUL_REGISTER"
            onClose={this.hideSnackabar}
            severity="success"
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

RegisterPage.contextType = LocalizationContext;

export default withRouter(RegisterPage);
