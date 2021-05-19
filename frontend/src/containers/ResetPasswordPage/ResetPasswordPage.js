import { Grid } from "@material-ui/core";
import React from "react";
import ResetPasswordForm from "../../components/ResetPasswordForm/ResetPasswordForm";

class ResetPasswordPage extends React.Component {
  render() {
    const handleSend = () => {};
    return (
      <>
        <Grid
          className="root"
          container
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={10} sm={6} md={4} lg={3}>
            <ResetPasswordForm onSend={handleSend} />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default ResetPasswordPage;
