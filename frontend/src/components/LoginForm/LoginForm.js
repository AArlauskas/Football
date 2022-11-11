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
import { useHistory } from "react-router";
import { uefaLogo, visibilityOffIcon, visibilityOnIcon } from "../../assets";
import { EMAIL_REGEX } from "../../constants/regex";

export default function LoginForm({ onLogin }) {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState({
    errorEmail: false,
    errorPassword: false,
  });

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
    onLogin(email, password);
  };

  return (
    <Paper>
      <CardContent direction="column" align="center" justify="center">
        <img src={uefaLogo} alt="uefa-2020 logo" width={75} height={75} />
        <Typography gutterBottom variant="h4">
          Prisijungti
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item container spacing={2}>
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
                      ? "Slaptažodis turi būti ne trumpesnis negu 6 simboliai"
                      : ""
                  }
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Slaptažodis"
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
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Prisijungti
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => history.push("/register")}
              >
                Registracija
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
}
