import React from "react";
import { Grid } from "@material-ui/core";
import ForgotPasswordForm from "../../components/ForgotPasswordForm/ForgotPasswordCard";

class ForgotPasswordPage extends React.Component {
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
          <Grid item xs={10} sm={6} md={4} lg={3}>
            <ForgotPasswordForm
              onSend={this.handleSendClick}
              // requestInProgress={requestInProgress}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default ForgotPasswordPage;
