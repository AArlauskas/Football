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
import { uefaLogo, visibilityOffIcon, visibilityOnIcon } from "../../assets";
import { NAME_REGEX, PASSWORD_REGEX } from "../../constants/regex";

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

    if (!NAME_REGEX.test(firstname)) {
      setShowError({ ...showError, errorFirstname: true });
      return;
    }
    if (!NAME_REGEX.test(lastname)) {
      setShowError({ ...showError, errorLastname: true });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setShowError({ ...showError, errorEmail: true });
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setShowError({ ...showError, errorPassword: true });
      return;
    }
    if (!PASSWORD_REGEX.test(confirmPassword)) {
      setShowError({ ...showError, errorConfirmPassword: true });
      return;
    }

    onRegister(firstname, lastname, email, password);
  };

  return (
    <Paper elevation={2}>
      <CardContent direction="column" align="center" justify="center">
        <img src={uefaLogo} alt="uefa-2020 logo" width={75} height={75} />
        <Typography gutterBottom variant="h4">
          Register
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
                    showError.errorFirstname ? "Please enter a valid name" : ""
                  }
                  variant="outlined"
                  type="text"
                  label="Firstname"
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
                    showError.errorLastname
                      ? "Please enter a valid surname"
                      : ""
                  }
                  variant="outlined"
                  type="text"
                  label="Lastname"
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
                    showError.errorEmail ? "Please enter a valid email" : ""
                  }
                  variant="outlined"
                  type="email"
                  label="Email"
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
                    showError.errorPassword
                      ? "Password must have at least 8 symbols with at least one capital letter and at least one number"
                      : ""
                  }
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="***********"
                  onChange={handlePasswordChange}
                  InputProps={{
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
                  error={showError.errorConfirmPassword}
                  helperText={
                    showError.errorConfirmPassword
                      ? "Password must have at least 8 symbols with at least one capital letter and at least one number and match previous password"
                      : ""
                  }
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="***********"
                  onChange={handleConfirmPasswordChange}
                  InputProps={{
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
            <Grid item xs={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" href="/">
                Back to login
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
}
