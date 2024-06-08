import {
  Button,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { uefaLogo, visibilityOffIcon, visibilityOnIcon } from "../../assets";
import { EMAIL_REGEX } from "../../constants/regex";

export default function RegisterForm({ onRegister }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showError, setShowError] = useState({
    errorFirstname: false,
    errorLastname: false,
    errorEmail: false,
    errorPassword: false,
    errorConfirmPassword: false,
  });

  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
  };
  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setShowError({ ...showError, errorEmail: true });
      return;
    }
    if (password.length < 6) {
      setShowError({ ...showError, errorPassword: true });
      return;
    }
    if (password !== confirmPassword) {
      setShowError({ ...showError, errorConfirmPassword: true });
      return;
    }

    onRegister(firstname, lastname, email, password);
  };

  return (
    <Paper elevation={2}>
      <CardContent direction="column" align="center" justify="center">
        <img src={uefaLogo} alt="uefa-2020 logo" width={150} />
        <Typography gutterBottom variant="h4">
          <FormattedMessage id="SIGN_UP" />
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <Grid item container spacing={3} xs={12}>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  error={showError.errorFirstname}
                  helperText={
                    showError.errorFirstname ? (
                      <FormattedMessage id="INVALID_FIRST_NAME" />
                    ) : (
                      ""
                    )
                  }
                  variant="outlined"
                  type="text"
                  label={<FormattedMessage id="FIRST_NAME" />}
                  placeholder="Gandalf"
                  onChange={handleFirstnameChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  error={showError.errorLastname}
                  helperText={
                    showError.errorLastname ? (
                      <FormattedMessage id="INVALID_LAST_NAME" />
                    ) : (
                      ""
                    )
                  }
                  variant="outlined"
                  type="text"
                  label={<FormattedMessage id="LAST_NAME" />}
                  placeholder="The Grey"
                  onChange={handleLastnameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={showError.errorEmail}
                  helperText={
                    showError.errorEmail ? (
                      <FormattedMessage id="INVALID_EMAIL" />
                    ) : (
                      ""
                    )
                  }
                  variant="outlined"
                  type="email"
                  label={<FormattedMessage id="EMAIL" />}
                  placeholder="john@doe.com"
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={showError.errorPassword}
                  helperText={
                    showError.errorPassword ? (
                      <FormattedMessage id="INVALID_PASSWORD" />
                    ) : (
                      ""
                    )
                  }
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label={<FormattedMessage id="PASSWORD" />}
                  placeholder="***********"
                  onChange={handlePasswordChange}
                  InputProps={{
                    autocomplete: "new-password",
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? (
                            <img
                              src={visibilityOnIcon}
                              alt="Password visibility icon"
                              width={24}
                              height={24}
                            />
                          ) : (
                            <img
                              src={visibilityOffIcon}
                              alt="Password visibility off icon"
                              width={24}
                              height={24}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  autoComplete="off"
                  error={showError.errorConfirmPassword}
                  helperText={
                    showError.errorConfirmPassword ? (
                      <FormattedMessage id="PASSWORDS_MUST_MATCH" />
                    ) : (
                      ""
                    )
                  }
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label={<FormattedMessage id="CONFIRM_PASSWORD" />}
                  placeholder="***********"
                  onChange={handleConfirmPasswordChange}
                  InputProps={{
                    autocomplete: "new-password",
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowConfirmPassword}>
                          {showPassword ? (
                            <img
                              src={visibilityOnIcon}
                              alt="Password visibility icon"
                              width={24}
                              height={24}
                            />
                          ) : (
                            <img
                              src={visibilityOffIcon}
                              alt="Password visibility off icon"
                              width={24}
                              height={24}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                <FormattedMessage id="REGISTER" />
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
}
