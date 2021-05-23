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
                      ? "Prašome įvesti teisingą vardą"
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
                      ? "Prašome įvesti teisingą pavardę"
                      : ""
                  }
                  variant="outlined"
                  type="text"
                  label="Pavardė"
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
                      ? "Prašome įvesti teisingą el. paštą"
                      : ""
                  }
                  variant="outlined"
                  type="email"
                  label="El. paštas"
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
                      ? "Slaptažodis turi turėti bent jau 8 simbolius su vienu skaitmeniu ir viena didžiąja raide"
                      : ""
                  }
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Slaptažodis"
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
                      ? "Slaptažodis turi turėti bent jau 8 simbolius su vienu skaitmeniu ir viena didžiąja raide. Slaptažodžiai turi sutapti"
                      : ""
                  }
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Patvirtinti slaptažodį"
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
