import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  AppBar,
  Button,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  Avatar,
  Hidden,
} from "@material-ui/core";
import { useHistory } from "react-router";
import LanguageFlagLT from "../../assets/Generic/LanguageFlagLT";
import { ArrowBackIcon, MenuIcon, uefaLogo as productIcon } from "../../assets";
import { GRAY_1, GRAY_5, SUNFLOWER } from "../../constants";
import "./styles.css";
import NavDrawer from "../NavDrawer/NavDrawer";
import { getPersonalPoints, logout } from "../../api/Api";
import LanguageFlagEN from "../../assets/Generic/LanguageFlagEN";
import LocalizationContext from "../TranslationsProvider/TranslationContext";
import LOCALES from "../../translations/locales";

export default function TopBar({ darkMode, showArrow, onActionIconClick }) {
  const iconFillColor = darkMode ? GRAY_5 : GRAY_1;
  const fontColor = "#fff";
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [points, setPoints] = useState(
    window.localStorage.getItem("points") || 0
  );

  const history = useHistory();
  const [language, setLanguage] = useContext(LocalizationContext);

  const toggleNavDrawer = () => setShowNavDrawer(!showNavDrawer);

  const onLogout = () => {
    window.localStorage.clear();
    window.location = "/";
    logout().finally(() => {});
  };

  const setPersonalPoints = () => {
    getPersonalPoints().then((response) => {
      window.localStorage.setItem("points", response.data.total);
      setPoints(response.data.total);
    });
  };

  useEffect(() => {
    setPersonalPoints();
  }, []);

  return (
    <>
      <NavDrawer
        open={showNavDrawer}
        onOpen={toggleNavDrawer}
        onClose={toggleNavDrawer}
      />
      <AppBar position="fixed" elevation={1}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            {showArrow ? (
              <Grid item>
                <IconButton edge="start" onClick={onActionIconClick}>
                  <ArrowBackIcon fill={iconFillColor} />
                </IconButton>
              </Grid>
            ) : (
              <Hidden smUp>
                <Grid item>
                  <IconButton edge="start" onClick={toggleNavDrawer}>
                    <MenuIcon fill={iconFillColor} />
                  </IconButton>
                </Grid>
              </Hidden>
            )}
            {!showArrow && (
              <Grid item>
                <IconButton edge="start" onClick={() => history.push("/home")}>
                  <img
                    style={{ marginTop: 10 }}
                    src={productIcon}
                    alt="Product icon"
                    width={45}
                    height={45}
                  />
                </IconButton>
              </Grid>
            )}
            <Grid item xs>
              <Hidden xsDown>
                <Grid item container style={{ textAlign: "center" }}>
                  <Grid
                    item
                    xs={3}
                    onClick={() => {
                      history.push("/home");
                    }}
                  >
                    <Typography
                      className={
                        window.location.pathname === "/home"
                          ? "navigation-current"
                          : "navigation"
                      }
                      style={{ color: fontColor }}
                      variant="overline"
                    >
                      <FormattedMessage id="GAMES" />
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    onClick={() => {
                      history.push("/personal");
                    }}
                  >
                    <Typography
                      className={
                        window.location.pathname === "/personal"
                          ? "navigation-current"
                          : "navigation"
                      }
                      style={{ color: fontColor }}
                      variant="overline"
                    >
                      <FormattedMessage id="GUESSES" />
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    onClick={() => {
                      history.push("/results");
                    }}
                  >
                    <Typography
                      className={
                        window.location.pathname === "/results"
                          ? "navigation-current"
                          : "navigation"
                      }
                      style={{ color: fontColor }}
                      variant="overline"
                    >
                      <FormattedMessage id="RESULTS" />
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    onClick={() => {
                      history.push("/rules");
                    }}
                  >
                    <Typography
                      className={
                        window.location.pathname === "/rules"
                          ? "navigation-current"
                          : "navigation"
                      }
                      style={{ color: fontColor, cursor: "pointer" }}
                      variant="overline"
                    >
                      <FormattedMessage id="RULES" />
                    </Typography>
                  </Grid>
                </Grid>
              </Hidden>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      if (localStorage.getItem("isAdmin") === "true")
                        history.push("/admin");
                    }}
                  >
                    <Avatar style={{ backgroundColor: SUNFLOWER }}>
                      {points}
                    </Avatar>
                  </IconButton>
                </Grid>
                <Grid item style={{ marginLeft: 15 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={onLogout}
                  >
                    <FormattedMessage id="LOG_OUT" />
                  </Button>
                </Grid>
                <Grid item>
                  {language === LOCALES.LITHUANIAN ? (
                    <Button
                      style={{ borderRadius: "50%" }}
                      onClick={() => setLanguage(LOCALES.ENGLISH)}
                    >
                      <LanguageFlagLT />
                    </Button>
                  ) : (
                    <Button
                      style={{ borderRadius: "50%" }}
                      onClick={() => setLanguage(LOCALES.LITHUANIAN)}
                    >
                      <LanguageFlagEN />
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
