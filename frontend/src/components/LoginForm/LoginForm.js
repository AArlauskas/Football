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
import { Link } from "react-router-dom";
import { uefaLogo, visibilityOffIcon, visibilityOnIcon } from "../../assets";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../constants/regex";

export default function LoginForm({ onLogin }) {
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
    if (!PASSWORD_REGEX.test(password)) {
      setShowError({ ...showError, errorPassword: true });
      return;
    }
    onLogin(email, password);
  };

  return (
    <Paper elevation={5}>
      <CardContent direction="column" align="center" justify="center">
        <img src={uefaLogo} alt="uefa-2020 logo" width={75} height={75} />
        <Typography gutterBottom variant="h4">
          Login
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
                    showError.errorEmail ? "Please enter a valid email" : ""
                  }
                  variant="outlined"
                  type="email"
                  label="Email address"
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
            </Grid>
            <Grid item xs={12}>
              <Typography align="left">
                <Link href="/forgot-password" variant="body2">
                  Forgot your password?
                </Link>
              </Typography>
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
              <Button variant="outlined" fullWidth href="/register">
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
}
