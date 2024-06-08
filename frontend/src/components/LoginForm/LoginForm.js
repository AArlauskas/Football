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
import { useHistory } from "react-router";
import { uefaLogo, visibilityOffIcon, visibilityOnIcon } from "../../assets";
import { IS_REGISTER_ENABLED } from "../../constants";
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
        <img src={uefaLogo} alt="uefa-2024 logo" height={50} />
        <Typography gutterBottom variant="h4">
          <FormattedMessage id="LOG_IN" />
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
            {IS_REGISTER_ENABLED ? (
              <>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage id="LOG_IN" />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => history.push("/register")}
                  >
                    <FormattedMessage id="REGISTER" />
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage id="LOG_IN" />
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
}
