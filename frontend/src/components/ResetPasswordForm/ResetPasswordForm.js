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
import {
  forgotPasswordDrawing,
  visibilityOffIcon,
  visibilityOnIcon,
} from "../../assets";

const ResetPasswordForm = ({ onSend, requestInProgress }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showConfirmPasswordError, setShowConfirmPasswordError] =
    useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setShowPasswordError(false);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setShowConfirmPasswordError(false);
  };

  const handleSendClick = (event) => {
    event.preventDefault();
    if (!PASSWORD_REGEX.test(password)) {
      setShowPasswordError(true);
      return;
    }
    if (password !== confirmPassword) {
      setShowConfirmPasswordError(true);
      return;
    }
    onSend(password);
  };
  return (
    <Paper elevation={5}>
      <CardContent direction="column" align="center" justify="center">
        <img
          src={forgotPasswordDrawing}
          width={75}
          height={75}
          alt="Illustration of a lock with a key inside"
        />
        <Typography variant="h4">Reset password</Typography>
        <Typography style={{ marginBottom: 16 }}>
          Enter a new password for your account
        </Typography>
        <form noValidate onSubmit={handleSendClick}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                error={showPasswordError}
                helperText={
                  showPasswordError
                    ? "Password must have at least 8 symbols with at least one capital letter and at least one number"
                    : ""
                }
                type={showPassword ? "text" : "password"}
                id="password-field"
                label="Password"
                placeholder="**********"
                variant="outlined"
                fullWidth
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? (
                          <img
                            src={visibilityOffIcon}
                            alt="Password visibility icon"
                            width={24}
                            height={24}
                          />
                        ) : (
                          <img
                            src={visibilityOnIcon}
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
                className="form__last-text-field"
                required
                error={showConfirmPasswordError}
                helperText={
                  showConfirmPasswordError ? "Passwords do not match" : ""
                }
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password-field"
                label="Confirm Password"
                placeholder="**********"
                variant="outlined"
                fullWidth
                onChange={handleConfirmPasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowConfirmPassword}>
                        {showConfirmPassword ? (
                          <img
                            src={visibilityOffIcon}
                            alt="Password visibility icon"
                            width={24}
                            height={24}
                          />
                        ) : (
                          <img
                            src={visibilityOnIcon}
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
            <Grid
              container
              direction="row"
              wrap="nowrap"
              item
              spacing={2}
              justify="center"
            >
              <Grid xs={6} item>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  disabled={requestInProgress}
                >
                  Send
                </Button>
              </Grid>
              <Grid xs={6} item>
                <Button variant="outlined" fullWidth href="/">
                  Back to login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
};

export default ResetPasswordForm;
