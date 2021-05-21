import React from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import CustomSnackbar from "../../components/CustomSnackbar/CustomSnackbar";
import TopBar from "../../components/TopBar/TopBar";
// import ChangeProfileForm from "../../components/ChangeProfileForm";
import "./styles.css";

class ProfilePage extends React.Component {
  render() {
    const firstName = "Aurimas";
    const lastName = "Arlauskas";
    const email = "auruxxas.ar@gmail.com";
    const {
      showSuccess,
      showConflictError,
      showGeneralError,
      showWrongPasswordError,
    } = this.state;

    const handleArrowBackClick = () => {
      const { history } = this.props;
      history.goBack();
    };

    const hideGeneralError = () => {
      this.setState({ showGeneralError: false });
    };

    const hideConflictError = () => {
      this.setState({ showConflictError: false });
    };

    const hideSuccess = () => {
      this.setState({ showSuccess: false });
    };

    const hideWrongPasswordError = () => {
      this.setState({ showWrongPasswordError: false });
    };

    const handleSaveChanges = (mail, oldPassword, newPassword) => {
      const credentials = {
        email: mail,
        oldPassword,
        newPassword,
      };
      updateCredentials(window.sessionStorage.getItem("id"), credentials)
        .then(() => {
          window.sessionStorage.setItem("email", mail);
          this.setState({ showSuccess: true });
        })
        .catch((ex) => {
          if (ex.response === undefined) {
            this.setState({ showConflictError: true });
            return;
          }
          const { status } = ex.response;
          if (status === 409) {
            this.setState({ showConflictError: true });
            return;
          }
          if (status === 400) {
            this.setState({ showWrongPasswordError: true });
            return;
          }
          this.setState({ showGeneralError: true });
        });
    };

    return (
      <>
        {showGeneralError && (
          <CustomSnackbar
            topCenter
            message="A server error has occured. Please try again later"
            onClose={hideGeneralError}
            severity="error"
          />
        )}
        {showConflictError && (
          <CustomSnackbar
            topCenter
            message="User with the email you specified already exists"
            onClose={hideConflictError}
            severity="error"
          />
        )}
        {showWrongPasswordError && (
          <CustomSnackbar
            topCenter
            message="Old password is not correct"
            onClose={hideWrongPasswordError}
            severity="error"
          />
        )}
        {showSuccess && (
          <CustomSnackbar
            topCenter
            message="Credentials changed successfully"
            onClose={hideSuccess}
            severity="success"
          />
        )}
        <Grid className="root" container direction="column">
          <Grid item>
            <TopBar
              showArrow
              title="Profile page"
              onActionIconClick={handleArrowBackClick}
              showAvatarAndLogout
              firstName={firstName}
              lastName={lastName}
            />
          </Grid>
          <Grid
            className="profileFormContainer"
            container
            alignItems="center"
            justify="center"
          >
            {/* <Grid item xs={11} sm={6} md={4} lg={3}>
              <ChangeProfileForm
                firstName={firstName}
                lastName={lastName}
                mail={email}
                onSaveChanges={handleSaveChanges}
              />
            </Grid> */}
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(ProfilePage);
