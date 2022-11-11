import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B1638",
    },
    secondary: {
      main: "#EDEEE4",
    },
  },
  overrides: {
    MuiPaper: {
      rounded: {
        borderRadius: "16px",
      },
    },
    MuiTabs: {
      indicator: {
        background: "rgb(139,22,56) !important",
      },
    },
    MuiTableRow: {
      root: {
        "&$selected": {
          backgroundColor: "rgba(139,22,56,0.2)",
          "&:hover": {
            backgroundColor: "rgba(139,22,56,0.3)",
          },
        },
      },
    },
    MuiTouchRipple: {
      root: {
        color: "#8B1638",
      },
    },
  },
});

export default theme;
