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
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from "../../constants/regex";

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
        <img src={uefaLogo} alt="uefa-2020 logo" width={75} height={75} />
        <Typography gutterBottom variant="h4">
          Registracija
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
                    showError.errorFirstname
                      ? "Pra??ome ??vesti teising?? vard??"
                      : ""
                  }
                  variant="outlined"
                  type="text"
                  label="Vardas"
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
                      ? "Pra??ome ??vesti teising?? pavard??"
                      : ""
                  }
                  variant="outlined"
                  type="text"
                  label="Pavard??"
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
                    showError.errorEmail
                      ? "Pra??ome ??vesti teising?? el. pa??t??"
                      : ""
                  }
                  variant="outlined"
                  type="email"
                  label="El. pa??tas"
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
                      ? "Slapta??odis turi b??ti ne trumpesnis negu 6 simboliai"
                      : ""
                  }
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Slapta??odis"
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
                    showError.errorConfirmPassword
                      ? "Slapta??od??iai turi sutapti"
                      : ""
                  }
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Patvirtinti slapta??od??"
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
                Registruotis
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
}
