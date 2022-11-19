import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert as MuiAlert } from "@material-ui/lab/";
import { FormattedMessage } from "react-intl";

/* eslint-disable react/jsx-props-no-spreading */
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CustomSnackbar = ({
  topCenter,
  messageIntl,
  severity,
  onClose,
  duration,
}) => (
  <Snackbar
    open
    anchorOrigin={
      topCenter
        ? { vertical: "top", horizontal: "center" }
        : { vertical: "bottom", horizontal: "left" }
    }
    autoHideDuration={duration || 3000}
    onClose={onClose}
  >
    <Alert severity={severity || "success"}>
      {<FormattedMessage id={messageIntl} /> || "Message with no provided text"}
    </Alert>
  </Snackbar>
);

export default CustomSnackbar;
