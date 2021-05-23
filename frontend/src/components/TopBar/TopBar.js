import React, { useState } from "react";
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
import { ArrowBackIcon, MenuIcon, uefaLogo as productIcon } from "../../assets";
import { GRAY_1, GRAY_5, GRAY_6, SUNFLOWER } from "../../constants";
import "./styles.css";
import NavDrawer from "../NavDrawer/NavDrawer";

export default function TopBar({
  points,
  darkMode,
  showArrow,
  onActionIconClick, // For arrow back or navigation drawer icons
  iconsToShow = [], // Array of Icon Components(like in DownloadIcon.js). These icons will be shown on right side of TopBar
  onIconsClick = [], // Array of on click callbacks for each icon in iconsToShow. NOTE: order of callbacks must match order of icons
  showAvatarAndLogout,
  disableIcons,
}) {
  const backgroundColor = darkMode ? GRAY_1 : GRAY_6;
  const iconFillColor = darkMode ? GRAY_5 : GRAY_1;
  const fontColor = darkMode ? GRAY_5 : GRAY_1;
  const [showNavDrawer, setShowNavDrawer] = useState(false);

  const toggleNavDrawer = () => setShowNavDrawer(!showNavDrawer);

  const onLogout = () => {
    window.sessionStorage.clear();
    window.location.reload();
  };

  const renderIcons = () => {
    const iconItems = iconsToShow.map((Icon, index) => (
      <Grid item key={index.toString()}>
        <IconButton
          onClick={onIconsClick[index]}
          edge="end"
          disabled={disableIcons}
        >
          <Icon fill={iconFillColor} />
        </IconButton>
      </Grid>
    ));

    return (
      <Grid container alignItems="center" spacing={1}>
        {iconItems}
      </Grid>
    );
  };

  return (
    <>
      <NavDrawer
        open={showNavDrawer}
        onOpen={toggleNavDrawer}
        onClose={toggleNavDrawer}
      />
      <AppBar
        style={{ background: backgroundColor }}
        position="fixed"
        elevation={1}
      >
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
                <IconButton edge="start" href="/">
                  <img
                    src={productIcon}
                    alt="Product icon"
                    width={36}
                    height={36}
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
                      window.location.href = "/home";
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
                      Varžybos
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    onClick={() => {
                      window.location.href = "/guesses";
                    }}
                  >
                    <Typography
                      className={
                        window.location.pathname === "/guesses"
                          ? "navigation-current"
                          : "navigation"
                      }
                      style={{ color: fontColor }}
                      variant="overline"
                    >
                      Spėjimai
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    onClick={() => {
                      window.location.href = "/results";
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
                      Rezultatai
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    onClick={() => {
                      window.location.href = "/rules";
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
                      Taisyklės
                    </Typography>
                  </Grid>
                </Grid>
              </Hidden>
            </Grid>
            <Grid item>{renderIcons()}</Grid>
            {showAvatarAndLogout && (
              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <IconButton edge="end" href="/profile">
                      <Avatar style={{ backgroundColor: SUNFLOWER }}>
                        {points || "AA"}
                      </Avatar>
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={onLogout}
                    >
                      Atsijungti
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
